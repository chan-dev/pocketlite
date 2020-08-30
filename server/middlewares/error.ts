import { Request, Response, NextFunction } from 'express';

import { ApiError, handleError } from '../helpers/error-handler';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.resourceNotFound('Resource Not Found'));
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
