import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';

import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as favoritesSelectors from '@app/features/bookmarks/state/selectors/favorites.selectors';
import * as bookmarksActions from '@app/features/bookmarks/state/actions/bookmarks.actions';

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
    this.bookmarks$ = combineLatest([
      this.store.pipe(select(bookmarksSelectors.selectBookmarksLoading)),
      this.store.pipe(select(bookmarksSelectors.selectArchivedBookmarks)),
    ]).pipe(
      filter(([loading, _]) => loading === false),
      map(([_, bookmarks]) => bookmarks)
    );

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
    );
  }

  ngOnInit() {
    this.store.dispatch(bookmarksActions.clearBookmarksOnArchive());
    this.store.dispatch(bookmarksActions.getArchivedBookmarks());
  }
}
