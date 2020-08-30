import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import Bookmark from '../models/bookmark';
import { ApiError } from '../helpers/error-handler';

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  async (req: Request, res: Response) => {
    const bookmarks = await Bookmark.find().exec();
    return res.json({ bookmarks });
  },
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    return next(ApiError.unauthenticated('Jwt authentication error'));
  }
);

export default router;
