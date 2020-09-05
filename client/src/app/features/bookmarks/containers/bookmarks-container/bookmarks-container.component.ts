import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bookmark } from '@models/bookmark.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmarks-container',
  templateUrl: './bookmarks-container.component.html',
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
export class BookmarksContainerComponent implements OnInit {
  private page = 1;
  bookmarks$: Observable<Bookmark[]>;

  constructor(private store: Store) {
    this.bookmarks$ = this.store.select(fromBookmarks.selectBookmarks);
    this.loadMore();
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
