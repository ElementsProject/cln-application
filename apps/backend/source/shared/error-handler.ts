import { Request, Response, NextFunction } from 'express';
import {
  APIError,
  BaseError,
  BitcoindError,
  LightningError,
  ValidationError,
} from '../models/errors.js';
import { HttpStatusCode } from './consts.js';
import { logger } from './logger.js';

function handleError(
  error: BaseError | APIError | BitcoindError | LightningError | ValidationError,
  req: Request,
  res: Response,
  next?: NextFunction,
) {
  var route = req.url || '';
  var message = error.message
    ? error.message
    : error.error
      ? error.error
      : typeof error === 'object'
        ? JSON.stringify(error)
        : typeof error === 'string'
          ? error
          : 'Unknown Error!';
  logger.error(message, route, error.stack);
  return res.status(error.statusCode || HttpStatusCode.INTERNAL_SERVER).json(message);
}

export default handleError;
