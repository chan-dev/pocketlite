import {
  createFeatureSelector,
  createSelector,
  ActionReducerMap,
} from '@ngrx/store';

import * as fromBookmarks from './bookmarks.reducer';
import * as fromFavorites from './favorites.reducer';

// TODO: include Tags state here
interface BookmarksState {
  bookmarks: fromBookmarks.State;
  favorites: fromFavorites.State;
}

export const reducers: ActionReducerMap<BookmarksState> = {
  bookmarks: fromBookmarks.reducer,
  favorites: fromFavorites.reducer,
};

export const selectBookmarksFeatureState = createFeatureSelector<
  BookmarksState
>('bookmarks');

// favorite state
export const selectFavoritesState = createSelector(
  selectBookmarksFeatureState,
  state => state.favorites
);
export const selectFavorites = createSelector(
  selectFavoritesState,
  fromFavorites.selectFavorites
);

// bookmarks state
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
export const selectCurrentBookmarks = createSelector(
  selectBookmarks,
  bookmarks => bookmarks.filter(b => !b.deleted)
);
export const selectArchivedBookmarks = createSelector(
  selectBookmarks,
  bookmarks => bookmarks.filter(b => b.deleted)
);
export const selectFavoritedBookmarks = createSelector(
  selectBookmarks,
  selectFavorites,
  (bookmarks, favorites) => {
    const favoritedBookmarkIds = favorites.map(fav => fav.bookmark_id);
    return bookmarks.filter(bookmark => {
      return favoritedBookmarkIds.includes(bookmark.id);
    });
  }
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
export * from './bookmarks.actions';
export * from './favorites.effects';
export * from './favorites.actions';
