import { createAction, props } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';

export const searchBookmark = createAction(
  '[Header] Search Bookmark',
  props<{ query: string }>()
);
export const searchBookmarkSuccess = createAction(
  '[Bookmarks API] Search Bookmark Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const searchBookmarkFailure = createAction(
  '[Bookmarks API] Search Bookmark Failure',
  props<{ error: string }>()
);
