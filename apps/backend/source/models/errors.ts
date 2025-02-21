import { HttpStatusCode } from '../shared/consts.js';

export class BaseError extends Error {
  public readonly code: HttpStatusCode;
  public readonly message: string;

  constructor(code: HttpStatusCode, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.message = message;
    Error.captureStackTrace(this);
  }
}

export class APIError extends BaseError {
  constructor(
    code: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
    message: string = 'Unknown API Server Error',
  ) {
    super(code, message);
  }
}

export class BitcoindError extends BaseError {
  constructor(
    code: HttpStatusCode = HttpStatusCode.BITCOIN_SERVER,
    message: string = 'Unknown Bitcoin API Error',
  ) {
    super(code, message);
  }
}

export class LightningError extends BaseError {
  constructor(
    code: HttpStatusCode = HttpStatusCode.LIGHTNING_SERVER,
    message: string = 'Unknown Core Lightning API Error',
  ) {
    super(code, message);
  }
}

export class ValidationError extends BaseError {
  constructor(
    code: HttpStatusCode = HttpStatusCode.INVALID_DATA,
    message: string = 'Unknown Validation Error',
  ) {
    super(code, message);
  }
}

export class AuthError extends BaseError {
  constructor(
    code: HttpStatusCode = HttpStatusCode.UNAUTHORIZED,
    message: string = 'Unknown Authentication Error',
  ) {
    super(code, message);
  }
}

export class GRPCError extends BaseError {
  constructor(
    code: HttpStatusCode = HttpStatusCode.GRPC_UNKNOWN,
    message: string = 'Unknown gRPC Error',
  ) {
    super(code, message);
  }
}
