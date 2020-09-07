import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap,
} from '@ngrx/store';

import * as fromBookmarks from './bookmarks.reducer';
import * as fromSearch from './search.reducer';

// TODO: include Tags state here
interface BookmarksState {
  bookmarks: fromBookmarks.State;
  search: fromSearch.State;
}

export const reducers: ActionReducerMap<BookmarksState> = {
  bookmarks: fromBookmarks.reducer,
  search: fromSearch.reducer,
};

export const selectBookmarksFeatureState = createFeatureSelector<
  BookmarksState
>('bookmarks');

// get the bookmarks slice out of the Feature BookmarksState
export const selectBookmarksState = createSelector(
  selectBookmarksFeatureState,
  state => state.bookmarks
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

// Search selectors
// get the bookmarks slice out of the Feature BookmarksState
export const selectSearchState = createSelector(
  selectBookmarksFeatureState,
  state => state.search
);
export const selectSearchResults = createSelector(
  selectSearchState,
  fromSearch.selectBookmarks
);
export const selectSearchCount = createSelector(
  selectSearchState,
  fromSearch.selectBookmarksCount
);
export const selectSearchLoading = createSelector(
  selectSearchState,
  state => state.loading
);

export const selectSearchError = createSelector(
  selectSearchState,
  state => state.error
);

export * from './bookmarks.effects';
export * from './search.effects';
export * from './bookmarks.actions';
export * from './search.actions';
