import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import Bookmark from '../models/bookmark';
import { ApiError } from '../helpers/error-handler';
import authJwt from '../middlewares/auth-jwt';

const router = express.Router();

router.get(
  '/',
  authJwt,
  async (req: Request, res: Response) => {
    const bookmarks = (res as any).paginatedResults;
    return res.json({ bookmarks });
  }
);
export default router;
