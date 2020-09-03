import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../classes/error';
import { handleError } from '../helpers/error-handler';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.resourceNotFound('Resource Not Found'));
};

export const transformUncaughtExceptions = (
  error: NodeJS.ErrnoException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.code === 'EBADCSRFTOKEN') {
    return next(ApiError.invalidCsrfToken('Invalid CSRF token'));
  }
  next(error);
};

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  return handleError(err, res);
};
