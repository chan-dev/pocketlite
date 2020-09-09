import { createAction, props } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';

export const startSearch = createAction(
  '[HeaderComponent] Start Search',
  props<{ query: string }>()
);
export const clearBookmarks = createAction(
  '[BookmarkSearchResultsContainerComponent] Clear Bookmarks'
);
export const searchBookmark = createAction(
  '[BookmarkSearchResultsContainerComponent] Search Bookmark'
);
export const searchBookmarkSuccess = createAction(
  '[Bookmarks API] Search Bookmark Success',
  props<{ bookmarks: Bookmark[] }>()
);
export const searchBookmarkFailure = createAction(
  '[Bookmarks API] Search Bookmark Failure',
  props<{ error: string }>()
);
