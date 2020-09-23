import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, withLatestFrom, concatMap, map } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmark-archives-container',
  templateUrl: './bookmark-archives-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkArchivesContainerComponent implements OnInit {
  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;

  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(fromBookmarks.selectBookmarksLoading),
      filter(loading => loading === false),
      concatMap(loading =>
        of(loading).pipe(
          withLatestFrom(
            this.store.select(fromBookmarks.selectArchivedBookmarks),
            (_, bookmarks) => {
              return bookmarks;
            }
          )
        )
      )
    );

    this.favorites$ = this.store.pipe(select(fromBookmarks.selectFavorites));
  }

  ngOnInit() {
    this.store.dispatch(fromBookmarks.clearBookmarksOnArchive());
    this.store.dispatch(fromBookmarks.getArchivedBookmarks());
  }
}
