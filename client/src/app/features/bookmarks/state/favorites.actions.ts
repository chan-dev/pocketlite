import { createAction, props } from '@ngrx/store';

import { BookmarkFavorite } from '@models/bookmark-favorite.model';

export const getFavorites = createAction('[FavoriteEffects] Get Favorites Ids');
export const getFavoritesSuccess = createAction(
  '[Bookmarks API] Get Favorites Success',
  props<{ favorites: BookmarkFavorite[] }>()
);
export const getFavoritesFailure = createAction(
  '[Bookmarks API] Get Favorites Failure',
  props<{ error: string }>()
);
