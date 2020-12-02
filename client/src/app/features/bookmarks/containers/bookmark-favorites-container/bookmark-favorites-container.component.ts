import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';

import { LOADER_DELAY, TIME_AFTER_LOADER_DELAY } from '@app/shared/constants';
import { showLoaderTime } from '@app/shared/helpers/operators/show-loader-time';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as favoritesSelectors from '@app/features/bookmarks/state/selectors/favorites.selectors';
import * as bookmarksActions from '@app/features/bookmarks/state/actions/bookmarks.actions';
import { LoadingState } from '../../state/reducers/bookmarks.reducer';

@Component({
  selector: 'app-bookmark-favorites-container',
  templateUrl: './bookmark-favorites-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkFavoritesContainerComponent implements OnInit {
  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;
  showLoader$: Observable<boolean>;

  constructor(private store: Store) {
    this.bookmarks$ = combineLatest([
      this.store.pipe(select(bookmarksSelectors.selectBookmarkCallState)),
      this.store.pipe(select(bookmarksSelectors.selectFavoritedBookmarks)),
    ]).pipe(
      filter(([callState, _]) => callState === LoadingState.LOADED),
      map(([_, bookmarks]) => bookmarks),
      share()
    );

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
    );
  }

  ngOnInit() {
    this.showLoader$ = this.bookmarks$.pipe(
      showLoaderTime(LOADER_DELAY, TIME_AFTER_LOADER_DELAY)
    );
    this.store.dispatch(bookmarksActions.clearBookmarksOnFavorite());
    this.store.dispatch(bookmarksActions.getFavoritedBookmarks());
  }
}
