import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import { BookmarksCollectionEmptyMessageDirective } from '@app/features/bookmarks/shared/directives/bookmarks-collection-empty-message.directive';
import * as bookmarksActions from '@app/features/bookmarks/state/actions/bookmarks.actions';
import * as favoritesActions from '@app/features/bookmarks/state/actions/favorites.actions';

@Component({
  selector: 'app-bookmarks-collection-container',
  templateUrl: './bookmarks-collection-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksCollectionContainerComponent implements OnInit {
  @Input() bookmarks: Bookmark[];
  @Input() favorites: BookmarkFavorite[];
  @Input() showLoader: boolean;

  @ContentChild(BookmarksCollectionEmptyMessageDirective, { read: TemplateRef })
  emptyMessage: TemplateRef<BookmarksCollectionEmptyMessageDirective>;

  placeholders = 9;

  constructor(private store: Store) {}

  ngOnInit() {}

  deleteBookmark(id: string) {
    this.store.dispatch(bookmarksActions.deleteBookmark({ id }));
  }

  archiveBookmark(id: string) {
    this.store.dispatch(bookmarksActions.archiveBookmark({ id }));
  }

  restoreBookmark(id: string) {
    this.store.dispatch(bookmarksActions.restoreBookmark({ id }));
  }

  toggleFavoriteBookmark({
    bookmark,
    favorited,
  }: {
    bookmark: Bookmark;
    favorited: boolean;
  }) {
    if (favorited) {
      this.store.dispatch(
        favoritesActions.unfavoriteBookmark({
          favorite: this.getBookmarkFavorite(bookmark),
        })
      );
    } else {
      this.store.dispatch(favoritesActions.favoriteBookmark({ bookmark }));
    }
  }

  updateBookmarkTags(bookmark: Bookmark) {
    this.store.dispatch(bookmarksActions.openTagsModal({ bookmark }));
  }

  isFavorited(bookmarkId: string) {
    return !!this.favorites.find(
      favorite => favorite.bookmark_id === bookmarkId
    );
  }

  generatePlaceholder(count: number) {
    // create an iterable of keys then convert to array
    return Array.from(Array(count).keys());
  }

  private getBookmarkFavorite(bookmark: Bookmark) {
    return this.favorites.find(favorite => {
      const { user_id, bookmark_id } = favorite;
      return bookmark.id === bookmark_id && bookmark.user_id === user_id;
    });
  }
}
