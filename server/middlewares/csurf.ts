import { Request, Response, NextFunction, RequestHandler } from 'express';

const csurfHandler = (csurfRequestHandler: RequestHandler) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const blackList = ['/api/auth/logout'];

  if (blackList.indexOf(req.url) > -1) {
    return next();
  }

  return csurfRequestHandler(req, res, next);
};

export default csurfHandler;
