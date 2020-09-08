import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bookmark } from '@models/bookmark.model';
import * as fromBookmarks from '@app/features/bookmarks/state';
import { tap, skip } from 'rxjs/operators';

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

  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(fromBookmarks.selectBookmarks),
      // NOTE: kinda hacky, selectors seem to fire once on
      // initial load even without any action dispatched
      skip(1),
      tap(_ => console.log('fetch bookmarks'))
    );
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
