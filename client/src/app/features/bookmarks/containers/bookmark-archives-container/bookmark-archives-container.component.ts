import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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
    this.bookmarks$ = combineLatest(
      this.store.pipe(select(fromBookmarks.selectBookmarksLoading)),
      this.store.pipe(select(fromBookmarks.selectArchivedBookmarks))
    ).pipe(
      filter(([loading, _]) => loading === false),
      map(([_, bookmarks]) => bookmarks)
    );

    this.favorites$ = this.store.pipe(select(fromBookmarks.selectFavorites));
  }

  ngOnInit() {
    this.store.dispatch(fromBookmarks.clearBookmarksOnArchive());
    this.store.dispatch(fromBookmarks.getArchivedBookmarks());
  }
}
