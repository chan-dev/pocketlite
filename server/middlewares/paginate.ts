import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../classes/error';
import { BookmarkModel, PaginateOptions } from 'models/bookmark';

const paginatedResults = (
  model: BookmarkModel,
  options: Omit<PaginateOptions, 'userId' | 'limit' | 'offset'>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // NOTE: we chose '+' for converting string to numeric
    // since parseInt or Number coerces invalid types to
    // valid values (i.e 1.xx is converted to 1)
    // while '+' returns NaN (i.e '+'1.xx returns NaN)
    let page = +(req.query.page as string);
    let limit = +(req.query.limit as string);
    let errorMessage = '';

    if (isNaN(page) || isNaN(limit)) {
      errorMessage = '`page` and `limit` should be numeric values';
      // return next(ApiError.invalidData(errorMessage));
      return next(ApiError.invalidData(errorMessage));
    }

    // check for empty values
    if (!page || !limit) {
      errorMessage = '`page` and `limit` are both required';
      return next(ApiError.invalidData(errorMessage));
    }

    // check for invalid input
    if (page < 1 || limit < 1) {
      errorMessage = "`page` or `limit` can't be less than 1";
      return next(ApiError.invalidData(errorMessage));
    }

    // place it after the checks so we won't execute this query
    // in case the inputs are incorrect
    const countDocuments = await model.countDocuments().exec();

    // we set the possible maximum limit value to the total
    if (limit > countDocuments) {
      limit = countDocuments;
    }

    const totalPages = Math.ceil(countDocuments / limit);

    // TODO: should we throw an error or just return an empty array
    if (page > totalPages) {
      return next(
        ApiError.invalidData(
          'The provided `page` exceeded the total number of pages for current items'
        )
      );
    }

    const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;

    const userId = (req as any).user.id;

    const paginateOptions: PaginateOptions = {
      userId,
      limit,
      offset: startIndex,
      sortBy: options.sortBy || 'createdAt',
      sortOrder: options.sortOrder || -1,
      archived: options.archived || false,
      favorited: options.favorited || false,
      q: options.q || '',
    };

    // TODO: make query helpers work here
    const results = await model.paginate(paginateOptions).exec();

    (res as any).paginatedResults = results || [];
    next();
  };
};

export default paginatedResults;
