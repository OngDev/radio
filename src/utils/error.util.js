class BaseError extends Error {
    constructor({ message, isOperational, status = 500 }) {
        super();
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

export class APIError extends BaseError {
    constructor({ message, errors, isOperational = true, status = 400 }) {
        super({ message, status, isOperational });
        this.errors = errors;
    }
}

export class ErrorHandler {
    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}

export const errorHandler = new ErrorHandler();