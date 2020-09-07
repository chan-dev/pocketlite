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
export const deleteBookmark = createAction(
  '[BookmarkPreviewsContainerComponent] Delete Bookmark',
  props<{ id: string }>()
);
export const deleteConfirm = createAction(
  '[ConfirmDialogComponent] Delete Confirm',
  props<{ id: string }>()
);
export const deleteCancel = createAction(
  '[ConfirmDialogComponent] Delete Cancel'
);
export const deleteBookmarkSuccess = createAction(
  '[Bookmarks API] Delete Bookmark Success',
  props<{ id: string }>()
);
export const deleteBookmarkFailure = createAction(
  '[Bookmarks API] Delete Bookmark Failure',
  props<{ error: string }>()
);
