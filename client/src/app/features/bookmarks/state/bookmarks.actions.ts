import { createAction, props } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';

export const getBookmarkItems = createAction(
  '[BookmarksContainerComponent] Get Bookmark Items',
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
export const saveBookmark = createAction(
  '[Header] Save Bookmark',
  props<{ url: string }>()
);
export const saveBookmarkSuccess = createAction(
  '[Bookmarks API] Save Bookmark Success',
  props<{ bookmark: Bookmark }>()
);
export const saveBookmarkFailure = createAction(
  '[Bookmarks API] Save Bookmark Failure',
  props<{ error: string }>()
);
