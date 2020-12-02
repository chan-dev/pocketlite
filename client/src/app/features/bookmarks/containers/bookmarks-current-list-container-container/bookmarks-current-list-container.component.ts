import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';

import { LOADER_DELAY, TIME_AFTER_LOADER_DELAY } from '@app/shared/constants';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as favoritesSelectors from '@app/features/bookmarks/state/selectors/favorites.selectors';
import * as bookmarksActions from '@app/features/bookmarks/state/actions/bookmarks.actions';
import {
  LoadingState,
  ErrorState,
} from '../../state/reducers/bookmarks.reducer';

import { showLoaderTime } from '@app/shared/helpers/operators/show-loader-time';

@Component({
  selector: 'app-bookmarks-current-list-container',
  templateUrl: './bookmarks-current-list-container.component.html',
  styles: [
    `
      :host {
        max-width: 100%;
      }

      .bookmark-list {
        min-height: 100%;
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
  showLoader$: Observable<boolean>;

  // TODO: move all logic inside ngOnInit
  constructor(private store: Store, private spinnerService: NgxSpinnerService) {
    this.bookmarks$ = combineLatest([
      this.store.pipe(select(bookmarksSelectors.selectBookmarkCallState)),
      this.store.pipe(select(bookmarksSelectors.selectCurrentBookmarks)),
    ]).pipe(
      tap(([callState, _]) => {
        const errorState = callState as ErrorState;
        if (errorState.error) {
          this.spinnerService.hide();
        }
      }),
      filter(([callState, _]) => callState === LoadingState.LOADED),
      map(([_, bookmarks]) => bookmarks),
      tap(() => this.spinnerService.hide()),
      share()
    );

    this.store.dispatch(bookmarksActions.clearBookmarksOnCurrentList());
    this.loadMore();

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
    );

    this.showLoader$ = this.bookmarks$.pipe(
      showLoaderTime(LOADER_DELAY, TIME_AFTER_LOADER_DELAY)
    );
  }

  ngOnInit() {}

  loadMoreItems() {
    this.page += 1;
    this.loadMore();
    this.spinnerService.show();
  }

  private loadMore() {
    this.store.dispatch(
      bookmarksActions.getBookmarkItems({
        page: this.page,
        limit: 15,
      })
    );
  }
}
