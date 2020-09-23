import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmarks-collection-container',
  templateUrl: './bookmarks-collection-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksCollectionContainerComponent implements OnInit {
  @Input() bookmarks: Bookmark[];
  @Input() favorites: BookmarkFavorite[];

  placeholders = 9;

  constructor(private store: Store) {}

  ngOnInit() {}

  deleteBookmark(id: string) {
    this.store.dispatch(fromBookmarks.deleteBookmark({ id }));
  }

  archiveBookmark(id: string) {
    this.store.dispatch(fromBookmarks.archiveBookmark({ id }));
  }

  restoreBookmark(id: string) {
    this.store.dispatch(fromBookmarks.restoreBookmark({ id }));
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
        fromBookmarks.unfavoriteBookmark({
          favorite: this.getBookmarkFavorite(bookmark),
        })
      );
    } else {
      this.store.dispatch(fromBookmarks.favoriteBookmark({ bookmark }));
    }
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
