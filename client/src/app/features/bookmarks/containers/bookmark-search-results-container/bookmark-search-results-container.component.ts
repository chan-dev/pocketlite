import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, of, BehaviorSubject } from 'rxjs';
import { filter, concatMap, withLatestFrom, tap } from 'rxjs/operators';

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

  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarksLoading),
      filter(loading => loading === false),
      concatMap(loading => {
        return of(loading).pipe(
          withLatestFrom(
            this.store.pipe(select(bookmarksSelectors.selectCurrentBookmarks)),
            (_, bookmarks) => bookmarks
          )
        );
      })
    );

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
    );
  }

  ngOnInit() {
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
