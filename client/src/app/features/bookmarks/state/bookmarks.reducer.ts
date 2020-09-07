import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Bookmark } from '@models/bookmark.model';
import * as bookmarkActions from './bookmarks.actions';

export interface State extends EntityState<Bookmark> {
  loading: boolean;
  error: string | null;
}

export function sortByCreateDate(a: Bookmark, b: Bookmark): number {
  // NOTE: we have to use Date.parse here rather than other
  // methods to convert because the strings are in the timestamp format
  // w/c returns NaN on other methods
  return Date.parse(b.created_at) - Date.parse(a.created_at);
}

export const adapter: EntityAdapter<Bookmark> = createEntityAdapter<Bookmark>({
  sortComparer: sortByCreateDate,
});
export const initialState: State = adapter.getInitialState({
  loading: false,
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
