import { HttpStatusCode } from '../shared/consts.js';

export class BaseError extends Error {
  public readonly message: string;
  public readonly error: string;
  public readonly statusCode: HttpStatusCode;
  public readonly name: string;

  constructor(message: string, error: string, statusCode: HttpStatusCode, name: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.name = name;
    Error.captureStackTrace(this);
  }
}

export class APIError extends BaseError {
  constructor(
    message: string = 'Unknown API Server Error',
    error: string = 'Unknown API Server Error',
    statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
    name: string = 'API Error',
  ) {
    super(message, error, statusCode, name);
  }
}

export class BitcoindError extends BaseError {
  constructor(
    message: string = 'Unknown Bitcoin API Error',
    error: any = 'Unknown Bitcoin API Error',
    statusCode: HttpStatusCode = HttpStatusCode.BITCOIN_SERVER,
    name: string = 'Bitcoin API Error',
  ) {
    super(message, error, statusCode, name);
  }
}

export class LightningError extends BaseError {
  constructor(
    message: string = 'Unknown Core Lightning API Error',
    error: any = 'Unkwown Core Lightning API Error',
    statusCode: HttpStatusCode = HttpStatusCode.CLN_SERVER,
    name: string = 'Core Lightning API Error',
  ) {
    super(message, error, statusCode, name);
  }
}

export class ValidationError extends BaseError {
  constructor(
    message: string = 'Unknown Validation Error',
    error: string = 'Unknown Validation Error',
    statusCode: HttpStatusCode = HttpStatusCode.INVALID_DATA,
    name: string = 'Validation Error',
  ) {
    super(message, error, statusCode, name);
  }
}
