import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bookmark } from '@models/bookmark.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmarks-list',
  templateUrl: './bookmarks-list.component.html',
  styles: [
    `
      :host {
        max-width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksListComponent implements OnInit {
  bookmarks$: Observable<Bookmark[]>;

  constructor(private store: Store) {
    this.bookmarks$ = this.store.select(fromBookmarks.selectBookmarks);
  }

  ngOnInit() {}
}
