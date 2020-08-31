import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bookmark } from '@models/bookmark.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksPageComponent {
  bookmarks$: Observable<Bookmark[]>;

  constructor(private store: Store) {
    this.store.dispatch(
      fromBookmarks.getBookmarkItems({
        page: 1,
        limit: 9,
      })
    );

    this.bookmarks$ = this.store.select(fromBookmarks.selectBookmarks);

    this.bookmarks$.subscribe(bookmarks => console.log({ bookmarks }));
  }
}
