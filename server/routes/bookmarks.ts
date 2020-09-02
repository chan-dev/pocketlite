import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import Bookmark from '../models/bookmark';
import scrapeLink from '../helpers/link-scraper';
import paginatedResults from '../middlewares/paginate';
import authJwt from '../middlewares/auth-jwt';
import { ApiError } from '../helpers/error-handler';
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
    const { url } = req.body;

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
        return next(ApiError.invalidData('Duplicate url'));
      }

      const bookmark = await scrapeLink(url);

      const newBookmark = new Bookmark({
        ...bookmark,
        user_id: mongoose.Types.ObjectId(),
      });

      const savedBookmark = await newBookmark.save();

      return res.json({
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
export default router;
