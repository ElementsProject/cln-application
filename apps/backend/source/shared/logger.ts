import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { Environment, APP_CONSTANTS } from './consts.js';

const logDir = path.dirname(APP_CONSTANTS.APP_LOG_FILE);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
}

export const logConfiguration = {
  transports: [
    new winston.transports.Console({
      level:
        APP_CONSTANTS.APP_MODE === Environment.PRODUCTION
          ? LogLevel.WARN
          : APP_CONSTANTS.APP_MODE === Environment.TESTING
            ? LogLevel.DEBUG
            : LogLevel.INFO,
      format: winston.format.combine(
        winston.format(info => {
          if (info.stack) delete info.stack;
          return info;
        })(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.json(),
        winston.format.colorize({ all: true }),
      ),
    }),
    new winston.transports.File({
      filename: path.basename(APP_CONSTANTS.APP_LOG_FILE),
      dirname: logDir,
      maxsize: 5 * 1024 * 1024,
      level:
        APP_CONSTANTS.APP_MODE === Environment.PRODUCTION
          ? LogLevel.DEBUG
          : APP_CONSTANTS.APP_MODE === Environment.TESTING
            ? LogLevel.DEBUG
            : LogLevel.DEBUG,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.json(),
        winston.format.colorize({ all: true }),
      ),
    }),
  ],
};

export const expressLogConfiguration = {
  ...logConfiguration,
  meta: APP_CONSTANTS.APP_MODE !== Environment.PRODUCTION,
  message: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
  expressFormat: false,
  colorize: true,
};

export const logger = winston.createLogger(logConfiguration);
