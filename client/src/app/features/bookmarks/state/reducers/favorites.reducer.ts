import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import { Bookmark } from '@models/bookmark.model';
import * as bookmarkFavoriteActions from '../actions/favorites.actions';

function isBookmark(model: BookmarkFavorite | Bookmark): model is Bookmark {
  return (model as Bookmark).title !== undefined;
}

/**
 * This is required for optimistic updates on favorite functionality
 *
 * Since every combination of user_id + bookmark_id is unique, we use
 * it as the model id in our store.
 *
 * We rather use this instead of the id from the database because we'll
 * immediately update the store state and not wait for the server response w/c
 * means we won't have the id available.
 *
 * This eliminates the need to know the id from the database and just depend
 * on the unique combination of user_id + bookmark_id.
 *
 */
export function generateFavoriteIdForAdapter(
  model: BookmarkFavorite | Bookmark
) {
  /**
   * We can check this with ("title" in model) check
   * but i just find it more readable to use explicit custom type guard
   */
  if (isBookmark(model)) {
    return model.user_id + model.id;
  }

  // at this point, model is now BookmarkFavorite
  // because of isBookmark type guard check
  return model.user_id + model.bookmark_id;
}

export interface State extends EntityState<BookmarkFavorite> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<BookmarkFavorite> = createEntityAdapter<
  BookmarkFavorite
>({
  selectId: generateFavoriteIdForAdapter,
});

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
  }),
  // It's important to use switchMap here
  on(
    bookmarkFavoriteActions.favoriteBookmark,
    bookmarkFavoriteActions.favoriteBookmarkInReaderPage,
    (state, { bookmark }) => {
      // optimistic save
      // update the state immediately
      const favorite: BookmarkFavorite = {
        id: '', // update this on favoriteSuccess action
        user_id: bookmark.user_id,
        bookmark_id: bookmark.id,
      };

      return adapter.addOne(favorite, {
        ...state,
        loading: true,
        error: null,
      });
    }
  ),
  on(bookmarkFavoriteActions.favoriteBookmarkSuccess, (state, { favorite }) => {
    /**
     * override the model we added on favoriteBookmark action with
     * the data from the server, this will override the "id" property
     */
    return adapter.updateOne(favorite, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(
    bookmarkFavoriteActions.favoriteBookmarkFailure,
    (state, { error, bookmark }) => {
      const favoriteId = generateFavoriteIdForAdapter(bookmark);

      // on error, remove the one we add on favoriteBookmark action
      return adapter.removeOne(favoriteId, {
        ...state,
        loading: false,
        error,
      });
    }
  ),
  on(
    bookmarkFavoriteActions.unfavoriteBookmark,
    bookmarkFavoriteActions.unfavoriteBookmarkInReaderPage,
    (state, { favorite }) => {
      // optimistic delete
      // update the state immediately
      const favoriteId = generateFavoriteIdForAdapter(favorite);

      // remove the one we add on favoriteBookmark action
      return adapter.removeOne(favoriteId, {
        ...state,
        loading: true,
        error: null,
      });
    }
  ),
  on(bookmarkFavoriteActions.unfavoriteBookmarkSuccess, state => {
    return {
      ...state,
      loading: false,
      error: null,
    };
  }),
  on(
    bookmarkFavoriteActions.unfavoriteBookmarkFailure,
    (state, { error, favorite }) => {
      // reset the one we optimistically deleted on unfavoriteBookmark action
      const bookmarkFavorite: BookmarkFavorite = {
        id: favorite.bookmark_id,
        user_id: favorite.user_id,
        bookmark_id: favorite.bookmark_id,
      };

      // re-add the removed state on error
      return adapter.addOne(bookmarkFavorite, {
        ...state,
        loading: false,
        error,
      });
    }
  )
);

export function reducer(state: State | undefined, action: Action) {
  return favoritesReducer(state, action);
}

// Selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// selector aliases
export const selectBookmarksIds = selectIds;
export const selectFavoritesEntities = selectEntities;
export const selectFavorites = selectAll;
export const selectFavoritesCount = selectTotal;
