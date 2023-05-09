import { HttpStatusCode } from '../shared/consts.js';
export class BaseError extends Error {
    message;
    error;
    statusCode;
    name;
    constructor(message, error, statusCode, name) {
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
    constructor(message = 'Unknown API Server Error', error = 'Unknown API Server Error', statusCode = HttpStatusCode.INTERNAL_SERVER, name = 'API Error') {
        super(message, error, statusCode, name);
    }
}
export class BitcoindError extends BaseError {
    constructor(message = 'Unknown Bitcoin API Error', error = 'Unknown Bitcoin API Error', statusCode = HttpStatusCode.BITCOIN_SERVER, name = 'Bitcoin API Error') {
        super(message, error, statusCode, name);
    }
}
export class LightningError extends BaseError {
    constructor(message = 'Unknown Core Lightning API Error', error = 'Unkwown Core Lightning API Error', statusCode = HttpStatusCode.LIGHTNING_SERVER, name = 'Core Lightning API Error') {
        super(message, error, statusCode, name);
    }
}
export class ValidationError extends BaseError {
    constructor(message = 'Unknown Validation Error', error = 'Unknown Validation Error', statusCode = HttpStatusCode.INVALID_DATA, name = 'Validation Error') {
        super(message, error, statusCode, name);
    }
}
