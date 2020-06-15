import { Response } from 'express';

export class AppError extends Error {
  constructor(public statusCode: string | number, public message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function handleError(
  error: Error | AppError,
  res: Response
): Response<JSON> {
  // This is to check for any uncaught exception
  const statusCode = 'statusCode' in error ? error.statusCode : 500;

  return res.json({
    statusCode,
    message: error.message,
  });
}
