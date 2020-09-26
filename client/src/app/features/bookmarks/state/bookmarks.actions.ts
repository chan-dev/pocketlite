import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

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
export const startSearch = createAction(
  '[HeaderComponent] Start Search',
  props<{ query: string }>()
);
export const clearBookmarksOnSearch = createAction(
  '[BookmarkSearchResultsContainerComponent] Clear Search Bookmarks'
);
export const clearBookmarksOnCurrentList = createAction(
  '[BookmarksCurrentListContainerComponent] Clear Current List Bookmarks'
);
export const searchBookmarks = createAction(
  '[BookmarkSearchResultsContainerComponent] Search Bookmarks'
);
export const searchBookmarksSuccess = createAction(
  '[Bookmarks API] Search Bookmarks Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const searchBookmarksFailure = createAction(
  '[Bookmarks API] Search Bookmarks Failure',
  props<{ error: string }>()
);
export const archiveBookmark = createAction(
  '[BookmarkPreviewsContainerComponent] Archive Bookmark',
  props<{ id: string }>()
);
export const archiveBookmarkSuccess = createAction(
  '[Bookmarks API] Archive Bookmark Success',
  props<{ bookmark: Update<Bookmark> }>()
);
export const archiveBookmarkFailure = createAction(
  '[Bookmarks API] Archive Bookmark Failure',
  props<{ error: string }>()
);
export const restoreBookmark = createAction(
  '[BookmarkPreviewsContainerComponent] Restore Bookmark',
  props<{ id: string }>()
);
export const restoreBookmarkSuccess = createAction(
  '[Bookmarks API] Restore Bookmark Success',
  props<{ bookmark: Update<Bookmark> }>()
);
export const restoreBookmarkFailure = createAction(
  '[Bookmarks API] Restore Bookmark Failure',
  props<{ error: string }>()
);
export const clearBookmarksOnArchive = createAction(
  '[BookmarkArchivedContainerComponent] Clear Archived Bookmarks'
);
export const getArchivedBookmarks = createAction(
  '[BookmarkArchivedContainerComponent] Get Archived Bookmarks'
);
export const getArchivedBookmarksSuccess = createAction(
  '[Bookmarks API] Get Archived Bookmarks Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const getArchivedBookmarksFailure = createAction(
  '[Bookmarks API] Get Archived Bookmarks Failure',
  props<{ error: string }>()
);

export const clearBookmarksOnFavorite = createAction(
  '[BookmarkFavoritesContainerComponent] Clear Favorited Bookmarks'
);
export const getFavoritedBookmarks = createAction(
  '[BookmarkFavoritesContainerComponent] Get Favorited Bookmarks'
);
export const getFavoritedBookmarksSuccess = createAction(
  '[Bookmarks API] Get Favorited Bookmarks Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const getFavoritedBookmarksFailure = createAction(
  '[Bookmarks API] Get Favorited Bookmarks Failure',
  props<{ error: string }>()
);

export const clearBookmarksOnTagFilter = createAction(
  '[BookmarksByTagContainerComponent] Clear Bookmarks On Tag Filter'
);
export const getBookmarksByTag = createAction(
  '[BookmarksByTagContainerComponent] Get Bookmarks By Tag'
);
export const getBookmarksByTagSuccess = createAction(
  '[Bookmarks API] Get Bookmarks By Tag Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const getBookmarksByTagFailure = createAction(
  '[Bookmarks API] Get Bookmarks By Tag Failure',
  props<{ error: string }>()
);
