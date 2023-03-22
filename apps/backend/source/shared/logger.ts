import winston from 'winston';
import { Environment, APP_CONSTANTS } from './consts.js';

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
        APP_CONSTANTS.APPLICATION_MODE === Environment.PRODUCTION
          ? LogLevel.WARN
          : APP_CONSTANTS.APPLICATION_MODE === Environment.TESTING
          ? LogLevel.DEBUG
          : LogLevel.INFO,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.json(),
        winston.format.colorize({ all: true }),
      ),
    }),
    new winston.transports.File({
      filename: APP_CONSTANTS.LOG_FILE_LOCATION,
      level:
        APP_CONSTANTS.APPLICATION_MODE === Environment.PRODUCTION
          ? LogLevel.WARN
          : APP_CONSTANTS.APPLICATION_MODE === Environment.TESTING
          ? LogLevel.DEBUG
          : LogLevel.INFO,
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
  meta: APP_CONSTANTS.APPLICATION_MODE !== Environment.PRODUCTION,
  message: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
  expressFormat: false,
  colorize: true,
};

export const logger = winston.createLogger(logConfiguration);
