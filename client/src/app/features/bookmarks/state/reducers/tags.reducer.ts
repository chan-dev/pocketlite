import { createReducer, Action, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Tag } from '@models/tag.model';
import * as tagActions from '../actions/tags.actions';
import * as bookmarkActions from '../actions/bookmarks.actions';

export interface State extends EntityState<Tag> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Tag> = createEntityAdapter<Tag>({});
export const initialState: State = adapter.getInitialState({
  loading: false,
  error: null,
});

const tagsReducer = createReducer(
  initialState,
  on(tagActions.getTags, state => {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }),
  on(tagActions.getTagsSuccess, (state, { tags }) => {
    return adapter.setAll(tags, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(tagActions.getTagsFailure, (state, { error }) => {
    return {
      ...state,
      error,
      loading: false,
    };
  }),
  on(bookmarkActions.updateBookmarkTagsSuccess, (state, { newTags }) => {
    return adapter.addMany(newTags, {
      ...state,
      loading: false,
      error: null,
    });
  }),
  on(tagActions.deleteTagConfirm, (state, { tag }) => {
    // optimistic delete, instantly remove the state from the store
    // so the delete tag will immediately be removed from the UI
    // instead of waiting for the API call to finish
    return adapter.removeOne(tag.id, {
      ...state,
      loading: true,
      error: null,
    });
  }),
  on(tagActions.deleteTagSuccess, (state, { tag }) => {
    return {
      ...state,
      loading: false,
      error: null,
    };
  }),
  on(tagActions.deleteTagFailure, (state, { error, tag }) => {
    // in case of a API error, we restore the one we deleted
    return adapter.addOne(tag, {
      ...state,
      loading: false,
      error,
    });
  })
);

export function reducer(state: State | undefined, action: Action) {
  return tagsReducer(state, action);
}

// Selectors
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

// selector aliases
export const selectTagIds = selectIds;
export const selectTagsEntities = selectEntities;
export const selectTags = selectAll;
export const selectTagsCount = selectTotal;
