import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, of, BehaviorSubject } from 'rxjs';
import { filter, concatMap, withLatestFrom, tap, share } from 'rxjs/operators';

import { LOADER_DELAY, TIME_AFTER_LOADER_DELAY } from '@app/shared/constants';
import { LoadingState } from '../../state/reducers/bookmarks.reducer';
import { showLoaderTime } from '@app/shared/helpers/operators/show-loader-time';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as fromRoot from '@app/core/core.state';
import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as favoritesSelectors from '@app/features/bookmarks/state/selectors/favorites.selectors';
import * as bookmarksActions from '@app/features/bookmarks/state/actions/bookmarks.actions';

@Component({
  selector: 'app-bookmark-search-results-container',
  templateUrl: './bookmark-search-results-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkSearchResultsContainerComponent
  implements OnInit, OnDestroy {
  private subscription: Subscription;
  private searchTermSubject = new BehaviorSubject<string>('');

  searchKeyword$ = this.searchTermSubject.asObservable();
  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;
  showLoader$: Observable<boolean>;

  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarkCallState),
      filter(callState => callState === LoadingState.LOADED),
      concatMap(loaded => {
        return of(loaded).pipe(
          withLatestFrom(
            this.store.pipe(select(bookmarksSelectors.selectCurrentBookmarks)),
            (_, bookmarks) => bookmarks
          )
        );
      }),
      share()
    );

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
    );
  }

  ngOnInit() {
    this.showLoader$ = this.bookmarks$.pipe(
      showLoaderTime(LOADER_DELAY, TIME_AFTER_LOADER_DELAY),
      tap(showLoader => console.log({ loaderArchives: showLoader }))
    );

    this.subscription = this.store
      .pipe(
        select(fromRoot.selectQueryParams),
        filter(params => params.hasOwnProperty('query')),
        tap(params => {
          this.searchTermSubject.next(params.query);
        })
      )
      .subscribe(params => {
        this.store.dispatch(bookmarksActions.clearBookmarksOnSearch());
        this.store.dispatch(bookmarksActions.searchBookmarks());
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
