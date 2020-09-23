import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import { Bookmark } from '@models/bookmark.model';

export const getFavorites = createAction('[FavoriteEffects] Get Favorites Ids');
export const getFavoritesSuccess = createAction(
  '[Bookmarks API] Get Favorites Success',
  props<{ favorites: BookmarkFavorite[] }>()
);
export const getFavoritesFailure = createAction(
  '[Bookmarks API] Get Favorites Failure',
  props<{ error: string }>()
);

export const favoriteBookmark = createAction(
  '[BookmarksCollectionContainerComponent] Favorite Bookmark',
  props<{ bookmark: Bookmark }>()
);
export const favoriteBookmarkSuccess = createAction(
  '[Bookmarks API] Favorite Bookmark Success',
  props<{ favorite: Update<BookmarkFavorite> }>()
);
export const favoriteBookmarkFailure = createAction(
  '[Bookmarks API] Favorite Bookmark Failure',
  props<{ error: string; bookmark: Bookmark }>()
);

export const unfavoriteBookmark = createAction(
  '[BookmarksCollectionContainerComponent] UnFavorite Bookmark',
  props<{ favorite: BookmarkFavorite }>()
);
export const unfavoriteBookmarkSuccess = createAction(
  '[Bookmarks API] UnFavorite Bookmark Success'
);
export const unfavoriteBookmarkFailure = createAction(
  '[Bookmarks API] UnFavorite Bookmark Failure',
  props<{ error: string; favorite: BookmarkFavorite }>()
);
