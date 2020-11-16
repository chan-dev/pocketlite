import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { filter, tap, concatMap, withLatestFrom } from 'rxjs/operators';

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

  constructor(private store: Store) {}

  ngOnInit() {
    this.bookmarks$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarksLoading),
      filter(loading => loading === false),
      concatMap(loading => {
        return of(loading).pipe(
          withLatestFrom(
            this.store.pipe(select(bookmarksSelectors.selectBookmarks)),
            (_, bookmarks) => bookmarks
          )
        );
      })
    );

    this.favorites$ = this.store.pipe(
      select(favoritesSelectors.selectFavorites)
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
