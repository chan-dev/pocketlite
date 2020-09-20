import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Bookmark, { BookmarkOptions } from '../models/bookmark';
import scrapeLink from '../helpers/link-scraper';
import paginatedResults from '../middlewares/paginate';
import authJwt from '../middlewares/auth-jwt';
import { ApiError } from '../classes/error';
import { validateUrl } from '../helpers/validators';

const router = express.Router();

router.get(
  '/',
  authJwt,
  paginatedResults(Bookmark),
  async (req: Request, res: Response) => {
    const bookmarks = (res as any).paginatedResults;
    return res.json({ bookmarks });
  }
);

router.post(
  '/',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const { url }: { url: string } = req.body;

    // NOTE:
    // check before passing the we do web scraping
    // since it's an expensive and slow task
    if (!validateUrl(url)) {
      return next(ApiError.invalidData('url is not valid'));
    }

    try {
      // NOTE:
      // check if URL already exist, we have to do this
      // even though we have set an unique index in URL
      // before proceeding to web-scraping since it's a expensive task
      const urlExists = await Bookmark.find({ url }).countDocuments();

      if (urlExists) {
        return next(ApiError.duplicateData('url is already saved'));
      }

      const bookmark = await scrapeLink(url);
      const userId = (req as any).user.id;

      const newBookmark = new Bookmark({
        ...bookmark,
        user_id: userId,
      });

      const savedBookmark = await newBookmark.save();

      return res.status(201).json({
        bookmark: savedBookmark,
      });
    } catch (err) {
      console.log({ ...err });
      // TODO: find a way to re-use to custom error handling
      if (err.code === 11000) {
        return next(ApiError.invalidData('Duplicate url'));
      }

      if (err instanceof mongoose.Error.ValidationError) {
        console.log('validation error');
        const errorKey = Object.keys(err.errors)[0];
        const errorMessage = `${errorKey} is not valid`;
        return next(ApiError.invalidData(errorMessage));
      }
      next(ApiError.internalServerError('Saving Bookmark Failed'));
    }
  }
);

router.get(
  '/search',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const q = (req.query.q || '') as string;
    const userId = (req as any).user.id;

    let options: BookmarkOptions = {
      userId,
      q,
      archived: false,
    };

    try {
      const bookmarks = await Bookmark.searchPartial(options).exec();

      return res.json({ bookmarks });
    } catch (err) {
      next(ApiError.internalServerError('Searching failed unexpectedly'));
    }
  }
);

router.delete(
  '/:id',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      // TODO: replace with findOneAndDelete?
      const bookmark = await Bookmark.deleteOne({ _id: id }).exec();
      return res.json({ id });
    } catch (err) {
      next(ApiError.internalServerError('Delete failed unexpectedly'));
    }
  }
);

router.put(
  '/archive/:id',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
      const bookmark = await Bookmark.deleteById(id).exec();

      return res.json({ bookmark });
    } catch (err) {
      next(ApiError.internalServerError('Archive failed unexpectedly'));
    }
  }
);

router.put(
  '/archive/:id/restore',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const bookmarkId = mongoose.Types.ObjectId(id);

    try {
      const bookmark = await Bookmark.restore({ _id: bookmarkId }).exec();

      return res.json({ bookmark });
    } catch (err) {
      next(
        ApiError.internalServerError('Restoring Archive failed unexpectedly')
      );
    }
  }
);

router.get(
  '/archives',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const bookmarks = await Bookmark.find()
        .byUser(userId)
        .findArchived(true)
        .exec();

      return res.json({ bookmarks });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError('Fetching Archives failed unexpectedly')
      );
    }
  }
);

export default router;
