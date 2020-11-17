import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Bookmark } from '@models/bookmark.model';
import * as bookmarkActions from '../actions/bookmarks.actions';

export enum LoadingState {
  INIT = 'INITIAL',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ErrorState {
  error: string;
}

export type CallState = LoadingState | ErrorState;

export interface State extends EntityState<Bookmark> {
  callState: CallState;
}

export function sortByCreateDate(a: Bookmark, b: Bookmark): number {
  // NOTE: we have to use Date.parse here rather than other
  // methods to convert because the strings are in the timestamp format
  // w/c returns NaN on other methods
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

export function getError(callState: CallState): string | null {
  const errorState = callState as ErrorState;

  if (errorState.error !== undefined) {
    return errorState.error;
  }

  return null;
}

export const adapter: EntityAdapter<Bookmark> = createEntityAdapter<Bookmark>({
  // sortComparer: sortByCreateDate,
});
export const initialState: State = adapter.getInitialState({
  callState: LoadingState.INIT,
});

const bookmarksReducer = createReducer(
  initialState,
  on(bookmarkActions.getBookmarkItems, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(bookmarkActions.loadBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.addMany(bookmarks, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.loadBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.saveBookmark, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(
    bookmarkActions.saveBookmarkSuccessWithStateChange,
    (state, { bookmark }) => {
      return adapter.addOne(bookmark, {
        ...state,
        callState: LoadingState.LOADED,
      });
    }
  ),
  on(bookmarkActions.saveBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.deleteConfirm, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(
    bookmarkActions.deleteBookmarkSuccess,
    bookmarkActions.deleteBookmarkSuccessInReaderPage,
    (state, { id }) => {
      return adapter.removeOne(id, {
        ...state,
        loading: false,
        error: null,
        callState: LoadingState.LOADED,
      });
    }
  ),
  on(bookmarkActions.deleteBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
      callState: { error },
    };
  }),
  on(bookmarkActions.archiveBookmark, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(
    bookmarkActions.archiveBookmarkSuccess,
    bookmarkActions.archiveBookmarkSuccessInReaderPage,
    (state, { bookmark }) => {
      // NOTE: we used setOne here instead of updateOne since
      // we'll let the package mongo_delete automate the soft delete
      // for us. We'll just replace that particular document
      return adapter.updateOne(bookmark, {
        ...state,
        callState: LoadingState.LOADED,
      });
    }
  ),
  on(bookmarkActions.archiveBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(
    bookmarkActions.restoreBookmark,
    bookmarkActions.restoreBookmarkInReaderPage,
    state => {
      return {
        ...state,
        callState: LoadingState.LOADING,
      };
    }
  ),
  on(
    bookmarkActions.restoreBookmarkSuccess,
    bookmarkActions.restoreBookmarkSuccessInReaderPage,
    (state, { bookmark }) => {
      // NOTE: we used setOne here instead of updateOne since
      // we'll let the package mongo_delete automate the soft delete
      // for us. We'll just replace that particular document
      return adapter.updateOne(bookmark, {
        ...state,
        callState: LoadingState.LOADED,
      });
    }
  ),
  on(bookmarkActions.restoreBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(
    bookmarkActions.clearBookmarksOnCurrentList,
    bookmarkActions.clearBookmarksOnSearch,
    bookmarkActions.clearBookmarksOnArchive,
    bookmarkActions.clearBookmarksOnFavorite,
    bookmarkActions.clearBookmarksOnTagFilter,
    state => {
      // TODO: try to set this equal to initialState
      return adapter.removeAll(state);
    }
  ),
  on(bookmarkActions.searchBookmarks, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(bookmarkActions.searchBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.searchBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.getArchivedBookmarks, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(bookmarkActions.getArchivedBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.getArchivedBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.getFavoritedBookmarks, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(bookmarkActions.getFavoritedBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.getFavoritedBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.getBookmarksByTag, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(bookmarkActions.getBookmarksByTagSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.getBookmarksByTagFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.updateBookmarkTagsSuccess, (state, { bookmark }) => {
    return adapter.updateOne(bookmark, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.updateBookmarkTagsFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.loadBookmarkFromApi, state => {
    return {
      ...state,
      callState: LoadingState.LOADING,
    };
  }),
  on(bookmarkActions.loadBookmarkFromApiSuccess, (state, { bookmark }) => {
    return adapter.upsertOne(bookmark, {
      ...state,
      callState: LoadingState.LOADED,
    });
  }),
  on(bookmarkActions.loadBookmarkFromApiFailure, (state, { error }) => {
    return {
      ...state,
      callState: { error },
    };
  }),
  on(bookmarkActions.selectBookmarkInStoreSuccess, (state, { bookmark }) => {
    return {
      ...state,
      callState: LoadingState.LOADED,
    };
  })
);

export function reducer(state: State | undefined, action: Action) {
  return bookmarksReducer(state, action);
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
export const selectBookmarksEntities = selectEntities;
export const selectBookmarks = selectAll;
export const selectBookmarksCount = selectTotal;
