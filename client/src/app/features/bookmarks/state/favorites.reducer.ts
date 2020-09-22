import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as bookmarkFavoriteActions from './favorites.actions';

export interface State extends EntityState<BookmarkFavorite> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<BookmarkFavorite> = createEntityAdapter<
  BookmarkFavorite
>({});
export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null,
});

const favoritesReducer = createReducer(
  initialState,
  on(bookmarkFavoriteActions.getFavorites, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkFavoriteActions.getFavoritesSuccess, (state, { favorites }) => {
    return adapter.setAll(favorites, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkFavoriteActions.getFavoritesFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return favoritesReducer(state, action);
}

// Selectors
const { selectEntities, selectAll, selectTotal } = adapter.getSelectors();

// selector aliases
export const selectFavoritesEntities = selectEntities;
export const selectFavorites = selectAll;
export const selectFavoritesCount = selectTotal;
