import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import expressWinston from 'express-winston';

import { logger, expressLogConfiguration } from './shared/logger.js';
import { CommonRoutesConfig } from './shared/routes.config.js';
import { LightningRoutes } from './routes/v1/lightning.js';
import { SharedRoutes } from './routes/v1/shared.js';
import { AuthRoutes } from './routes/v1/auth.js';
import { APIError } from './models/errors.js';
import { API_VERSION, APP_CONSTANTS, Environment, HttpStatusCode } from './shared/consts.js';
import handleError from './shared/error-handler.js';
import { LightningService } from './service/lightning.service.js';
import { parseTrustProxy } from './shared/utils.js';
import { csrfProtection } from './shared/csrf.js';

const directoryName = dirname(fileURLToPath(import.meta.url));
const routes: Array<CommonRoutesConfig> = [];

export const app: express.Application = express();

const NATIVE_TLS = APP_CONSTANTS.APP_TLS_KEY_FILE !== '' && APP_CONSTANTS.APP_TLS_CERT_FILE !== '';
export const server: http.Server = NATIVE_TLS
  ? https.createServer(
      {
        key: fs.readFileSync(APP_CONSTANTS.APP_TLS_KEY_FILE),
        cert: fs.readFileSync(APP_CONSTANTS.APP_TLS_CERT_FILE),
      },
      app,
    )
  : http.createServer(app);

const APP_PORT = normalizePort(process.env.APP_PORT || '2103');
const APP_HOST = process.env.APP_HOST || 'localhost';
const APP_PROTOCOL = process.env.APP_PROTOCOL || 'http';

const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '::1', '[::1]'];
export function isLoopbackHost(host: string) {
  return LOOPBACK_HOSTS.includes(host) || host.startsWith('127.');
}

function logTransportWarnings() {
  if (NATIVE_TLS && APP_PROTOCOL !== 'https') {
    logger.warn(
      'APP_TLS_KEY_FILE and APP_TLS_CERT_FILE are set but APP_PROTOCOL is not https. ' +
        'Set APP_PROTOCOL=https so cookies are marked Secure and HSTS is sent.',
    );
  }
  if (APP_PROTOCOL === 'http' && !isLoopbackHost(APP_HOST)) {
    logger.warn(
      `The application is served over plain HTTP on ${APP_HOST}:${APP_PORT}. ` +
        'The login password and session cookie cross the network unencrypted. ' +
        'Place it behind a TLS-terminating reverse proxy (then set APP_PROTOCOL=https), ' +
        'or set APP_TLS_KEY_FILE and APP_TLS_CERT_FILE to serve HTTPS directly.',
    );
  }
  if (APP_PROTOCOL === 'https' && !NATIVE_TLS) {
    logger.info(
      'APP_PROTOCOL is https while the server listens on plain HTTP: TLS must be terminated by ' +
        'a reverse proxy in front of the app. Browsers reject the Secure cookies over plain http.',
    );
  }
  if (APP_CONSTANTS.APP_SINGLE_SIGN_ON === 'true') {
    logger.warn(
      'APP_SINGLE_SIGN_ON is true: the login screen is disabled and every request that reaches ' +
        `${APP_HOST}:${APP_PORT} is treated as the authenticated operator. Keep this port ` +
        'reachable only through the platform proxy that performs the login.',
    );
  }
}

export function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

app.use(bodyParser.json({ limit: '500kb' }));
app.set('trust proxy', parseTrustProxy(APP_CONSTANTS.APP_TRUST_PROXY));
app.use(cookieParser());
app.use(csrfProtection);
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'connect-src': ["'self'"],
        'font-src': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'frame-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
      },
    },
    strictTransportSecurity: APP_PROTOCOL === 'https' ? { maxAge: 15552000 } : false,
    crossOriginOpenerPolicy: APP_PROTOCOL === 'https',
    originAgentCluster: APP_PROTOCOL === 'https',
  }),
);
app.use((req, res, next) => {
  // API responses carry runes and keys, so keep them out of the browser cache entirely
  res.setHeader('Cache-Control', req.path.startsWith(API_VERSION + '/') ? 'no-store' : 'no-cache');
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=()');
  next();
});

const corsOptions = {
  methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  origin:
    APP_CONSTANTS.APP_MODE === Environment.PRODUCTION
      ? `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}`
      : `${APP_PROTOCOL}://localhost:4300`,
  credentials: true,
  allowedHeaders: 'Content-Type, X-XSRF-TOKEN, XSRF-TOKEN',
};
app.use(cors(corsOptions));

app.use(expressWinston.logger(expressLogConfiguration));
app.use(expressWinston.errorLogger(expressLogConfiguration));

export const throwApiError = (err: any) => {
  switch (err.code) {
    case 'EACCES':
      return new APIError(
        HttpStatusCode.ACCESS_DENIED,
        `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT} requires elevated privileges`,
      );
    case 'EADDRINUSE':
      return new APIError(
        HttpStatusCode.CONFLICT,
        `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT} is already in use`,
      );
    case 'ECONNREFUSED':
      return new APIError(HttpStatusCode.UNAUTHORIZED, 'Server is down/locked');
    case 'EBADCSRFTOKEN':
      return new APIError(HttpStatusCode.FORBIDDEN, 'Invalid CSRF token. Form tempered.');
  }
  switch (err?.type) {
    case 'entity.too.large':
      return new APIError(HttpStatusCode.PAYLOAD_TOO_LARGE, 'Request body too large');
    case 'entity.parse.failed':
      return new APIError(HttpStatusCode.BAD_REQUEST, 'Malformed JSON body');
  }
  if (
    err?.expose === true &&
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 500
  ) {
    return new APIError(err.status, err.message);
  }
  logger.error('Unhandled error: ' + (err?.message || err), err?.stack);
  return new APIError(HttpStatusCode.INTERNAL_SERVER, 'Internal server error');
};

async function startServer() {
  try {
    const clnService = new LightningService();

    const authRoutes = new AuthRoutes(app);
    const sharedRoutes = new SharedRoutes(app, clnService);
    const lightningRoutes = new LightningRoutes(app, clnService);

    authRoutes.configureRoutes();
    sharedRoutes.configureRoutes();
    lightningRoutes.configureRoutes();

    routes.push(authRoutes, sharedRoutes, lightningRoutes);

    // serve frontend
    app.use('/', express.static(join(directoryName, '..', '..', 'frontend', 'build')));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((req: express.Request, res: express.Response, next: any) => {
      res.sendFile(join(directoryName, '..', '..', 'frontend', 'build', 'index.html'));
    });

    // Global error handler for requests
    app.use((err: any, req: express.Request, res: express.Response, next: any) => {
      return handleError(throwApiError(err), req, res, next);
    });

    server.on('error', (err: any) => {
      if (err.code) {
        logger.error('On Server Error: ', err);
      } else {
        logger.error('On Server Error: ', throwApiError(err));
      }
      process.exit(1);
    });

    server.on('listening', () => {
      logger.warn(`Server running at ${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}`);
      logTransportWarnings();
    });

    server.listen({ port: APP_PORT, host: APP_HOST });
  } catch (err: any) {
    if (err.code) {
      logger.error('Server Startup Error:', err);
    } else {
      logger.error('Server Startup Error:', throwApiError(err));
    }
    process.exit(1);
  }
}

startServer();

process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
