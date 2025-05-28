import { Request, Response, NextFunction } from 'express';
import {
  APIError,
  BaseError,
  BitcoindError,
  GRPCError,
  LightningError,
  ValidationError,
} from '../models/errors.js';
import { HttpStatusCode } from './consts.js';
import { logger } from './logger.js';

function handleError(
  error: BaseError | APIError | BitcoindError | LightningError | ValidationError | GRPCError,
  req: Request,
  res: Response,
  next?: NextFunction,
) {
  const route = req.url || '';
  const message = error.message
    ? error.message
    : typeof error === 'object'
      ? JSON.stringify(error)
      : typeof error === 'string'
        ? error
        : 'Unknown Error!';
  logger.error(message, route, error.stack);
  return res.status(error.code || HttpStatusCode.INTERNAL_SERVER).json(message);
}

export default handleError;
