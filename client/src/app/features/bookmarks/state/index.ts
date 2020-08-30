import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap,
} from '@ngrx/store';

import * as fromBookmarks from './bookmarks.reducer';

// TODO: include Tags state here
interface BookmarksState {
  bookmarks: fromBookmarks.State;
}

export const reducers: ActionReducerMap<BookmarksState> = {
  bookmarks: fromBookmarks.reducer,
};

export const selectBookmarksState = createFeatureSelector<fromBookmarks.State>(
  'bookmarks'
);
export const selectBookmarksIds = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarksIds
);
export const selectBookmarksEntities = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarksEntities
);
export const selectBookmarks = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarks
);
export const selectBookmarksCount = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarksCount
);
export const selectBookmarksLoading = createSelector(
  selectBookmarksState,
  state => state.loading
);

export const selectBookmarksError = createSelector(
  selectBookmarksState,
  state => state.error
);

export * from './bookmarks.effects';
