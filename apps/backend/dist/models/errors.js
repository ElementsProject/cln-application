import { HttpStatusCode } from '../shared/consts.js';
export class BaseError extends Error {
    code;
    message;
    constructor(code, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this);
    }
}
export class APIError extends BaseError {
    constructor(code = HttpStatusCode.INTERNAL_SERVER, message = 'Unknown API Server Error') {
        super(code, message);
    }
}
export class BitcoindError extends BaseError {
    constructor(code = HttpStatusCode.BITCOIN_SERVER, message = 'Unknown Bitcoin API Error') {
        super(code, message);
    }
}
export class LightningError extends BaseError {
    constructor(code = HttpStatusCode.LIGHTNING_SERVER, message = 'Unknown Core Lightning API Error') {
        super(code, message);
    }
}
export class ValidationError extends BaseError {
    constructor(code = HttpStatusCode.INVALID_DATA, message = 'Unknown Validation Error') {
        super(code, message);
    }
}
export class AuthError extends BaseError {
    constructor(code = HttpStatusCode.UNAUTHORIZED, message = 'Unknown Authentication Error') {
        super(code, message);
    }
}
export class GRPCError extends BaseError {
    constructor(code = HttpStatusCode.GRPC_UNKNOWN, message = 'Unknown gRPC Error') {
        super(code, message);
    }
}
