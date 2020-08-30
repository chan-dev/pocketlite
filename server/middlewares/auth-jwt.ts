import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { ApiError } from '../helpers/error-handler';

const authJwt = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', function (err, user, info) {
    if (err) return next(err);
    if (!user) throw ApiError.unauthenticated('User is not authenticated');
    req.user = user;
    next();
  })(req, res, next);
};

export default authJwt;
