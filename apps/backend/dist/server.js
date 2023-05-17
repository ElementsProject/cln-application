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
import { LightningRoutes } from './routes/v1/lightning.js';
import { SharedRoutes } from './routes/v1/shared.js';
import { APIError } from './models/errors.js';
import { APP_CONSTANTS, Environment, HttpStatusCode } from './shared/consts.js';
import handleError from './shared/error-handler.js';
let directoryName = dirname(fileURLToPath(import.meta.url));
let routes = [];
const app = express();
const server = http.createServer(app);
const LIGHTNING_PORT = normalizePort(process.env.APP_CORE_LIGHTNING_PORT || '2103');
const APP_CORE_LIGHTNING_IP = process.env.APP_CORE_LIGHTNING_IP || 'localhost';
const APP_PROTOCOL = process.env.APP_PROTOCOL || 'http';
function normalizePort(val) {
    var port = parseInt(val, 10);
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
app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; frame-src 'self'; style-src 'self';");
    next();
});
const corsOptions = {
    methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    origin: APP_CONSTANTS.APP_MODE === Environment.PRODUCTION
        ? APP_PROTOCOL + '://' + APP_CORE_LIGHTNING_IP + ':' + LIGHTNING_PORT
        : APP_PROTOCOL + '://localhost:4300',
    credentials: true,
    allowedHeaders: 'Content-Type, X-XSRF-TOKEN, XSRF-TOKEN',
};
app.use(cors(corsOptions));
app.use(expressWinston.logger(expressLogConfiguration));
app.use(expressWinston.errorLogger(expressLogConfiguration));
routes.push(new SharedRoutes(app));
routes.push(new LightningRoutes(app));
// serve frontend
app.use('/', express.static(join(directoryName, '..', '..', 'frontend', 'build')));
app.use((req, res, next) => {
    res.sendFile(join(directoryName, '..', '..', 'frontend', 'build', 'index.html'));
});
app.use((err, req, res, next) => {
    return handleError(throwApiError(err), req, res, next);
});
const throwApiError = (err) => {
    logger.error('Server error: ' + err);
    switch (err.code) {
        case 'EACCES':
            return new APIError(APP_PROTOCOL +
                '://' +
                APP_CORE_LIGHTNING_IP +
                ':' +
                LIGHTNING_PORT +
                ' requires elevated privileges', APP_PROTOCOL +
                '://' +
                APP_CORE_LIGHTNING_IP +
                ':' +
                LIGHTNING_PORT +
                ' requires elevated privileges', HttpStatusCode.ACCESS_DENIED, APP_PROTOCOL +
                '://' +
                APP_CORE_LIGHTNING_IP +
                ':' +
                LIGHTNING_PORT +
                ' requires elevated privileges');
        case 'EADDRINUSE':
            return new APIError(APP_PROTOCOL + '://' + APP_CORE_LIGHTNING_IP + ':' + LIGHTNING_PORT + ' is already in use', APP_PROTOCOL + '://' + APP_CORE_LIGHTNING_IP + ':' + LIGHTNING_PORT + ' is already in use', HttpStatusCode.ADDR_IN_USE, APP_PROTOCOL + '://' + APP_CORE_LIGHTNING_IP + ':' + LIGHTNING_PORT + ' is already in use');
        case 'ECONNREFUSED':
            return new APIError('Server is down/locked', 'Server is down/locked', HttpStatusCode.UNAUTHORIZED, 'Server is down/locked');
        case 'EBADCSRFTOKEN':
            return new APIError('Invalid CSRF token. Form tempered.', 'Invalid CSRF token. Form tempered.', HttpStatusCode.BAD_CSRF_TOKEN, 'Invalid CSRF token. Form tempered.');
        default:
            return new APIError('Default: ' + JSON.stringify(err), 'Default: ' + JSON.stringify(err), 400, 'Default: ' + JSON.stringify(err));
    }
};
server.on('error', throwApiError);
server.on('listening', () => logger.warn('Server running at ' + APP_PROTOCOL + '://' + APP_CORE_LIGHTNING_IP + ':' + LIGHTNING_PORT));
server.listen({ port: LIGHTNING_PORT, host: APP_CORE_LIGHTNING_IP });
