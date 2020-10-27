import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Bookmark } from '@models/bookmark.model';
import * as bookmarkActions from '../actions/bookmarks.actions';

export interface State extends EntityState<Bookmark> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export function sortByCreateDate(a: Bookmark, b: Bookmark): number {
  // NOTE: we have to use Date.parse here rather than other
  // methods to convert because the strings are in the timestamp format
  // w/c returns NaN on other methods
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}

export const adapter: EntityAdapter<Bookmark> = createEntityAdapter<Bookmark>({
  // sortComparer: sortByCreateDate,
});
export const initialState: State = adapter.getInitialState({
  loading: false,
  loaded: false,
  error: null,
});

const bookmarksReducer = createReducer(
  initialState,
  on(bookmarkActions.getBookmarkItems, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.loadBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.addMany(bookmarks, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.loadBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.saveBookmark, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.saveBookmarkSuccess, (state, { bookmark }) => {
    return adapter.addOne(bookmark, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.saveBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.deleteConfirm, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.deleteBookmarkSuccess, (state, { id }) => {
    return adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.deleteBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.archiveBookmark, state => {
    return {
      ...state,
      loading: true,
      error: null,
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
        loading: false,
        error: null,
      });
    }
  ),
  on(bookmarkActions.archiveBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(
    bookmarkActions.restoreBookmark,
    bookmarkActions.restoreBookmarkInReaderPage,
    state => {
      return {
        ...state,
        loading: true,
        error: null,
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
        loading: false,
        error: null,
      });
    }
  ),
  on(bookmarkActions.restoreBookmarkFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
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
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.searchBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.searchBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.getArchivedBookmarks, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.getArchivedBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.getArchivedBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.getFavoritedBookmarks, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.getFavoritedBookmarksSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.getFavoritedBookmarksFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.getBookmarksByTag, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.getBookmarksByTagSuccess, (state, { bookmarks }) => {
    return adapter.setAll(bookmarks, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.getBookmarksByTagFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.updateBookmarkTagsSuccess, (state, { bookmark }) => {
    return adapter.updateOne(bookmark, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(bookmarkActions.updateBookmarkTagsFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  }),
  on(bookmarkActions.loadBookmarkFromApi, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(bookmarkActions.loadBookmarkFromApiSuccess, (state, { bookmark }) => {
    return adapter.upsertOne(bookmark, {
      ...state,
      loading: false,
      loaded: true,
    });
  }),
  on(bookmarkActions.loadBookmarkFromApiFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      error,
    };
  }),
  on(bookmarkActions.selectBookmarkInStoreSuccess, (state, { bookmark }) => {
    return {
      ...state,
      loading: false,
      loaded: true,
      error: null,
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
