import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import expressWinston from 'express-winston';

import { logger, expressLogConfiguration } from './shared/logger.js';
import { CommonRoutesConfig } from './shared/routes.config.js';
import { LightningRoutes } from './routes/v1/lightning.js';
import { SharedRoutes } from './routes/v1/shared.js';
import { AuthRoutes } from './routes/v1/auth.js';
import { APIError } from './models/errors.js';
import { APP_CONSTANTS, Environment, HttpStatusCode } from './shared/consts.js';
import handleError from './shared/error-handler.js';
import { LightningService } from './service/lightning.service.js';

const directoryName = dirname(fileURLToPath(import.meta.url));
const routes: Array<CommonRoutesConfig> = [];

export const app: express.Application = express();
export const server: http.Server = http.createServer(app);

const APP_PORT = normalizePort(process.env.APP_PORT || '2103');
const APP_HOST = process.env.APP_HOST || 'localhost';
const APP_PROTOCOL = process.env.APP_PROTOCOL || 'http';

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

app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '25mb' }));
app.set('trust proxy', true);
app.use(cookieParser());
app.use(csurf({ cookie: true }) as unknown as express.RequestHandler);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self'; img-src 'self' data:; script-src 'self'; frame-src 'self'; style-src 'self';",
  );
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
        HttpStatusCode.ADDR_IN_USE,
        `${APP_PROTOCOL}://${APP_HOST}:${APP_PORT} is already in use`,
      );
    case 'ECONNREFUSED':
      return new APIError(HttpStatusCode.UNAUTHORIZED, 'Server is down/locked');
    case 'EBADCSRFTOKEN':
      return new APIError(HttpStatusCode.BAD_CSRF_TOKEN, 'Invalid CSRF token. Form tempered.');
    default:
      return new APIError(HttpStatusCode.BAD_REQUEST, err?.message || err);
  }
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

    server.on('listening', () =>
      logger.warn(`Server running at ${APP_PROTOCOL}://${APP_HOST}:${APP_PORT}`),
    );

    server.listen({ port: APP_PORT, host: APP_HOST });
  } catch (err: any) {
    if (err.code) {
      logger.error('Server Startup Error: ', err);
    } else {
      logger.error('Server Startup Error: ', throwApiError(err));
    }
    process.exit(1);
  }
}

startServer();

process.on('uncaughtException', err => {
  logger.error('I M HERE');
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
