import express, { Request, Response, NextFunction } from 'express';
import mongoose, { DocumentQuery } from 'mongoose';

import { UNTAGGED_ITEMS } from '@constants/tags';
import Bookmark, {
  BookmarkOptions,
  BookmarkDocumentQuery,
} from '../models/bookmark';
import Tag from '../models/tag';
import BookmarkFavorite from '../models/bookmark-favorite';
import scrapeLink from '../helpers/link-scraper';
import paginatedResults from '../middlewares/paginate';
import authJwt from '../middlewares/auth-jwt';
import { ApiError } from '../classes/error';
import { validateUrl } from '../helpers/validators';

const router = express.Router();

router.get(
  '/',
  authJwt,
  paginatedResults(Bookmark, {
    sortBy: 'created_at',
    sortOrder: -1,
    archived: false,
    favorited: false,
    q: '',
  }),
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

router.get(
  '/favorites',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;

      const bookmarkFavorites = await BookmarkFavorite.find({
        user_id: userId,
      }).exec();

      const bookmarkFavoriteIds = bookmarkFavorites.map(fav => fav.bookmark_id);

      const bookmarks = await Bookmark.find()
        .byUser(userId)
        .where('_id')
        .in(bookmarkFavoriteIds)
        .exec();

      return res.json({ bookmarks });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError(
          'Fetching Favorited Bookmarks failed unexpectedly'
        )
      );
    }
  }
);

router.get(
  '/favorited',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      console.log({ userId });
      const favorites = await BookmarkFavorite.find({
        user_id: userId,
      }).exec();

      return res.json({ favorites });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError('Fetching Favorites failed unexpectedly')
      );
    }
  }
);

router.post(
  '/favorite',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { bookmarkId } = req.body;

      const bookmarkFavorite = new BookmarkFavorite({
        user_id: userId,
        bookmark_id: bookmarkId,
      });

      const favorite = await bookmarkFavorite.save();

      return res.status(201).json({ favorite });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError('Favorite Bookmark failed unexpectedly')
      );
    }
  }
);

router.delete(
  '/favorite/:id',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const favorite = await BookmarkFavorite.findOneAndDelete({
        _id: id,
      }).exec();

      return res.status(200).json({ favorite });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError('Unfavorite Bookmark failed unexpectedly')
      );
    }
  }
);

router.get(
  '/tags/:name',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    let query: BookmarkDocumentQuery;

    try {
      const userId = (req as any).user.id;
      const tagName = req.params.name;

      if (tagName === UNTAGGED_ITEMS) {
        query = Bookmark.find({
          user_id: userId,
        })
          .where('tags')
          .size(0);
      } else {
        // get the associated tag from Tag collection
        const currentTag = await Tag.findOne({
          user_id: userId,
          name: tagName,
        }).exec();

        query = Bookmark.find({
          user_id: userId,
        })
          .where('tags')
          .in([currentTag?.id]);
      }

      // find bookmark containing that tag
      const bookmarks = await query.exec();

      return res.json({ bookmarks });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError(
          'Fetching Bookmarks by tag failed unexpectedly'
        )
      );
    }
  }
);

router.put(
  '/:id/tags',
  authJwt,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const bookmarkId = req.params.id;
      const { selectedTags }: { selectedTags: string[] } = req.body;

      /* Step 1: Find all existing tags from Tag collection */
      const foundTags = await Tag.find({
        user_id: userId,
        name: {
          $in: selectedTags,
        },
      }).exec();

      /* Step 2: Find all new unsaved tags */
      const foundTagNames = foundTags.map(tag => tag.name);
      const unsavedTags = selectedTags.filter(
        tag => !foundTagNames.includes(tag)
      );

      /* Step 3: Save all unsaved tags in Tag collection */
      const newTags = await Tag.insertMany(
        unsavedTags.map(tag => ({
          user_id: userId,
          name: tag,
        }))
      );

      /* Step 4: Merge foundTags and newTags */
      const bookmarkTagIds = [...foundTags, ...newTags].map(tag => tag.id);

      /* Step 5: Update current bookmark tags */
      const bookmark = await Bookmark.findOneAndUpdate(
        { _id: bookmarkId },
        {
          $set: {
            tags: bookmarkTagIds,
          },
        },
        // IMPORTANT: we need to return the modified document
        { new: true }
      ).exec();

      return res.json({ bookmark, newTags });
    } catch (err) {
      console.log({ err });
      next(
        ApiError.internalServerError('Saving Bookmark Tags failed unexpectedly')
      );
    }
  }
);

// TODO: this is just for testing
router.get(
  '/test-collect',
  async (req: Request, res: Response, next: NextFunction) => {
    const urls = [
      'https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04',
      'https://www.typescriptlang.org/tsconfig#rootDir',
      'https://vim.rtorr.com/',
      'https://www.twilio.com/blog/guide-node-js-logging#:~:text=Your%20Server%20Application%20Logs,User%2DAgent%20is%20being%20used.',
      'https://stackblitz.com/edit/angular-toggle-observable',
    ];

    const urlsToTest = urls.map(url => scrapeLink(url));

    try {
      const data = await Promise.all(urlsToTest);
      return res.json({
        data,
      });
    } catch (err) {
      console.log({ err });
      // TODO: replace with the actual error
      next(ApiError.internalServerError('Saving Bookmark Failed'));
    }
  },
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log({
      err: {
        ...err,
      },
    });
    // TODO: fix bug in this route-level error handler
    return next(ApiError.unauthenticated('Jwt authentication error'));
  }
);

router.get(
  '/test',
  async (req: Request, res: Response, next: NextFunction) => {
    /* const { url } = req.body; */
    const articleTypeUrl =
      'https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04';
    const nonArticleTypeUrl = 'https://www.typescriptlang.org/tsconfig#rootDir';

    // TODO: just change this variable for testing;
    const isArticle = true;
    const testUrl = isArticle ? articleTypeUrl : nonArticleTypeUrl;

    const url = 'https://vim.rtorr.com/';

    try {
      const data = await scrapeLink(url);
      return res.json({
        data,
      });
    } catch (err) {
      console.log({ err });
      // TODO: replace with the actual error
      next(ApiError.internalServerError('Saving Bookmark Failed'));
    }
  },
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log({
      err: {
        ...err,
      },
    });
    // TODO: fix bug in this route-level error handler
    return next(ApiError.unauthenticated('Jwt authentication error'));
  }
);
export default router;
