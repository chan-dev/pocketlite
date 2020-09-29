import { createSelector } from '@ngrx/store';

import { selectBookmarksFeatureState } from '../bookmarks.state';
import * as fromFavorites from '../reducers/favorites.reducer';

export const selectFavoritesState = createSelector(
  selectBookmarksFeatureState,
  state => state.favorites
);
export const selectFavorites = createSelector(
  selectFavoritesState,
  fromFavorites.selectFavorites
);
