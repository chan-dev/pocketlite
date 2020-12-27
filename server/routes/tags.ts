import express, { Request, Response, NextFunction } from 'express';

import Tag from '../models/tag';
import Bookmark from '../models/bookmark';
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

router.delete(
  '/:id',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const tag = await Tag.findOneAndDelete({ _id: id });
      if (tag) {
        await Bookmark.updateMany(
          {},
          {
            $pull: {
              tags: id,
            },
          }
        );
        return res.status(200).json({ tag });
      } else {
        return next(ApiError.resourceNotFound('tag does not exist'));
      }
    } catch (err) {
      next(ApiError.internalServerError('Deleting tags failed unexpectedly'));
    }
  }
);

export default router;
