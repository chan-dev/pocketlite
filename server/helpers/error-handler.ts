import { Response } from 'express';
import { ApiError } from '../classes/error';

export function handleError(error: ApiError, res: Response): Response<JSON> {
  // This is to check for any uncaught exception
  // if it's NOT a custom error then use the statusCode for the response,
  // otherwise, default to status 500
  const statusCode = error?.statusCode || res.statusCode || 500;

  return res.status(statusCode).json({
    statusCode,
    message: error.message,
    name: error.name,
    errorCode: error.errorCode,
    payload: error.payload,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
}
