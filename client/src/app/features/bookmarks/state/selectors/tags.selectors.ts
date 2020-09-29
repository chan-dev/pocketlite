import { createSelector } from '@ngrx/store';

import { selectBookmarksFeatureState } from '../bookmarks.state';
import * as fromTags from '../reducers/tags.reducer';

export const selectTagsState = createSelector(
  selectBookmarksFeatureState,
  state => state.tags
);
export const selectTags = createSelector(selectTagsState, fromTags.selectTags);
