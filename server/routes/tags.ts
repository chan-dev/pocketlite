import express, { Request, Response, NextFunction } from 'express';

import Tag from '../models/tag';
import authJwt from '../middlewares/auth-jwt';
import { ApiError } from '../classes/error';

const router = express.Router();

router.get(
  '/',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    try {
      const tags = await Tag.find({
        user_id: userId,
      }).exec();

      return res.json({ tags });
    } catch (err) {
      next(ApiError.internalServerError('Finding tags failed unexpectedly'));
    }
  }
);

router.post(
  '/',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    // extract an array of tag names from req.body
    const tagNames = req.body.tags as string[];

    const newTags = tagNames.map(tag => {
      return {
        user_id: userId,
        name: tag,
      };
    });

    try {
      const tags = await Tag.insertMany(newTags);

      return res.json({ tags });
    } catch (err) {
      next(ApiError.internalServerError('Finding tags failed unexpectedly'));
    }
  }
);

export default router;
