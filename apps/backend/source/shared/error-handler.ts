import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../models/errors.js';
import { HttpStatusCode } from './consts.js';
import { logger } from './logger.js';

const GENERIC_MESSAGE = 'Internal server error';

function toStatus(code: unknown): number {
  return Number.isInteger(code) && (code as number) >= 400 && (code as number) <= 599
    ? (code as number)
    : HttpStatusCode.INTERNAL_SERVER;
}

function describe(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function handleError(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next?: NextFunction,
) {
  const route = req.originalUrl || req.url || '';
  if (error instanceof BaseError) {
    logger.error(error.message, route);
    return res.status(toStatus(error.code)).json(error.message);
  }
  logger.error('Unhandled error on ' + route + ': ' + describe(error), (error as any)?.stack);
  return res.status(HttpStatusCode.INTERNAL_SERVER).json(GENERIC_MESSAGE);
}

export default handleError;
