import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Bookmark } from '@models/bookmark.model';
import * as bookmarkActions from './bookmarks.actions';

export interface State extends EntityState<Bookmark> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Bookmark> = createEntityAdapter<Bookmark>(
  {}
);
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
  })
);

export function reducer(state: State | undefined, action: Action) {
  return bookmarksReducer(state, action);
}
