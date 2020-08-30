import { createAction, props } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';

export const getBookmarkItems = createAction(
  '[Bookmarks Page] Get Bookmark Items',
  props<{ page: number; limit: number }>()
);
export const loadBookmarksSuccess = createAction(
  '[Bookmarks API] Load Bookmarks Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const loadBookmarksFailure = createAction(
  '[Bookmarks API] Load Bookmarks Failure',
  props<{ error: string }>()
);
