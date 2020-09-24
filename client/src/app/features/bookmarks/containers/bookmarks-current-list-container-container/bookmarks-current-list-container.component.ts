import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmarks-current-list-container',
  templateUrl: './bookmarks-current-list-container.component.html',
  styles: [
    `
      :host {
        max-width: 100%;
      }

      .bookmark-list {
        height: 100vh;
        overflow-y: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksCurrentListContainerComponent implements OnInit {
  private page = 1;

  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.bookmarks$ = combineLatest(
      this.store.pipe(select(fromBookmarks.selectBookmarksLoading)),
      this.store.pipe(select(fromBookmarks.selectCurrentBookmarks))
    ).pipe(
      filter(([loading, _]) => loading === false),
      map(([_, bookmarks]) => bookmarks)
    );

    this.store.dispatch(fromBookmarks.clearBookmarksOnCurrentList());
    this.loadMore();

    this.favorites$ = this.store.pipe(select(fromBookmarks.selectFavorites));
  }

  ngOnInit() {}

  onScroll() {
    this.page += 1;
    this.loadMore();
  }

  private loadMore() {
    this.store.dispatch(
      fromBookmarks.getBookmarkItems({
        page: this.page,
        limit: 9,
      })
    );
  }
}
