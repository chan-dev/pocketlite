import { ActionReducerMap } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBookmarks from './reducers/bookmarks.reducer';
import * as fromFavorites from './reducers/favorites.reducer';
import * as fromTags from './reducers/tags.reducer';

export interface BookmarksState {
  bookmarks: fromBookmarks.State;
  favorites: fromFavorites.State;
  tags: fromTags.State;
}

export const reducers: ActionReducerMap<BookmarksState> = {
  bookmarks: fromBookmarks.reducer,
  favorites: fromFavorites.reducer,
  tags: fromTags.reducer,
};

export const selectBookmarksFeatureState = createFeatureSelector<
  BookmarksState
>('bookmarks');

export const selectBookmarksState = createSelector(
  selectBookmarksFeatureState,
  state => state.bookmarks
);
