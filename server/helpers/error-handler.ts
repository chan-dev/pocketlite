import { Response } from 'express';

export class ApiError extends Error {
  static BAD_REQUEST = 400;
  static UNAUTHENTICATED = 401;
  static FORBIDDEN = 403;
  static RESOURCE_NOT_FOUND = 404;
  static INTERNAL_SERVER_ERROR = 500;
  static INVALID_DATA = 422;

  constructor(public statusCode: number, public message: string) {
    super(message);
    this.statusCode = statusCode;
    /* Error.captureStackTrace(this); */
  }

  static badRequest(message: string): ApiError {
    return new ApiError(ApiError.BAD_REQUEST, message);
  }

  static unauthenticated(message: string): ApiError {
    return new ApiError(ApiError.UNAUTHENTICATED, message);
  }

  static invalidData(message: string): ApiError {
    return new ApiError(ApiError.INVALID_DATA, message);
  }

  static resourceNotFound(message: string): ApiError {
    return new ApiError(ApiError.RESOURCE_NOT_FOUND, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(ApiError.FORBIDDEN, message);
  }

  static internalServerError(message: string): ApiError {
    return new ApiError(ApiError.INTERNAL_SERVER_ERROR, message);
  }
}

export function handleError(error: ApiError, res: Response): Response<JSON> {
  // This is to check for any uncaught exception
  /* const statusCode = 'statusCode' in error ? error.statusCode : 500; */
  const statusCode = error?.statusCode || 500;

  return res.status(statusCode).json({
    statusCode,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
}
