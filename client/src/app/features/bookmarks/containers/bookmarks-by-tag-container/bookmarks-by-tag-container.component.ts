import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { filter, tap, concatMap, withLatestFrom, share } from 'rxjs/operators';

import { LOADER_DELAY, TIME_AFTER_LOADER_DELAY } from '@app/shared/constants';
import { LoadingState } from '../../state/reducers/bookmarks.reducer';
import { showLoaderTime } from '@app/shared/helpers/operators/show-loader-time';
import * as fromRoot from '@app/core/core.state';
import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as favoritesSelectors from '@app/features/bookmarks/state/selectors/favorites.selectors';
import * as bookmarksActions from '@app/features/bookmarks/state/actions/bookmarks.actions';
import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';

@Component({
  selector: 'app-bookmarks-by-tag-container',
  templateUrl: './bookmarks-by-tag-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksByTagContainerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private tagSubject = new BehaviorSubject<string>('');

  header: string;
  selectedTag$ = this.tagSubject.asObservable();
  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;
  showLoader$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.bookmarks$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarkCallState),
      filter(callState => callState === LoadingState.LOADED),
      concatMap(loaded => {
        return of(loaded).pipe(
          withLatestFrom(
            this.store.pipe(select(bookmarksSelectors.selectBookmarks)),
            (_, bookmarks) => bookmarks
          )
        );
      }),
      share()
    );

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
    );

    this.showLoader$ = this.bookmarks$.pipe(
      showLoaderTime(LOADER_DELAY, TIME_AFTER_LOADER_DELAY),
      tap(showLoader => console.log({ loaderArchives: showLoader }))
    );

    this.subscription = this.store
      .pipe(
        select(fromRoot.selectRouteParams),
        // /tags/:name
        filter(params => params.hasOwnProperty('name')),
        tap(params => (this.header = params.name)),
        tap(params => {
          this.tagSubject.next(params.name);
        })
      )
      .subscribe(params => {
        this.store.dispatch(bookmarksActions.clearBookmarksOnTagFilter());
        this.store.dispatch(bookmarksActions.getBookmarksByTag());
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
