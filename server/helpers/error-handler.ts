import { Response } from 'express';

export class AppError extends Error {
  constructor(public statusCode: string | number, public message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function handleError(error: AppError, res: Response): Response<JSON> {
  const { statusCode, message } = error;

  return res.json({
    statusCode,
    message,
  });
}
