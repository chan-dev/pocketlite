import { createSelector } from '@ngrx/store';

import { selectBookmarksState } from '../bookmarks.state';
import * as fromBookmarks from '../reducers/bookmarks.reducer';
import * as tagsSelectors from '../selectors/tags.selectors';
import * as favoritesSelectors from '../selectors/favorites.selectors';

export const selectBookmarksIds = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarksIds
);
export const selectBookmarksEntities = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarksEntities
);
// unsorted default order
export const selectBookmarks = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarks
);
// sorted bookmaks
export const selectBookmarksSortedByCreatedAt = createSelector(
  selectBookmarks,
  state =>
    [...state].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
);
export const selectBookmarksSortedByDeletedAt = createSelector(
  selectBookmarks,
  state =>
    [...state].sort((a, b) => Date.parse(b.deletedAt) - Date.parse(a.deletedAt))
);
export const selectCurrentBookmarks = createSelector(
  selectBookmarksSortedByCreatedAt,
  bookmarks => bookmarks.filter(b => !b.deleted)
);
export const selectArchivedBookmarks = createSelector(
  selectBookmarksSortedByDeletedAt,
  bookmarks => bookmarks.filter(b => b.deleted)
);
export const selectFavoritedBookmarks = createSelector(
  selectBookmarks,
  favoritesSelectors.selectFavorites,
  (bookmarks, favorites) => {
    const favoritedBookmarkIds = favorites.map(fav => fav.bookmark_id);
    return bookmarks.filter(bookmark => {
      return favoritedBookmarkIds.includes(bookmark.id);
    });
  }
);
export const selectBookmarkTagIds = (id: string) => {
  return createSelector(selectBookmarksEntities, state => state[id]?.tags);
};
export const selectBookmarkTags = (id: string) => {
  return createSelector(
    tagsSelectors.selectTags,
    selectBookmarkTagIds(id),
    (allTags, tagIds) => allTags.filter(tag => tagIds.includes(tag.id))
  );
};
export const selectBookmarksCount = createSelector(
  selectBookmarksState,
  fromBookmarks.selectBookmarksCount
);
export const selectBookmarkCallState = createSelector(
  selectBookmarksState,
  state => state.callState
);

export const selectBookmarksError = createSelector(
  selectBookmarkCallState,
  fromBookmarks.getError
);

export const selectCurrentBookmark = (id: string) =>
  createSelector(selectBookmarksEntities, entities => entities[id]);
