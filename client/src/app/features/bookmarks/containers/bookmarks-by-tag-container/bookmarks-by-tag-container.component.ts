import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, Observable, of } from 'rxjs';
import { filter, tap, concatMap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '@app/core/core.state';
import * as fromBookmarks from '@app/features/bookmarks/state';
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

  header: string;
  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.bookmarks$ = this.store.pipe(
      select(fromBookmarks.selectBookmarksLoading),
      filter(loading => loading === false),
      concatMap(loading => {
        return of(loading).pipe(
          withLatestFrom(
            this.store.pipe(select(fromBookmarks.selectCurrentBookmarks)),
            (_, bookmarks) => bookmarks
          )
        );
      })
    );

    this.favorites$ = this.store.pipe(select(fromBookmarks.selectFavorites));

    this.subscription = this.store
      .pipe(
        select(fromRoot.selectRouteParams),
        // /tags/:name
        filter(params => params.hasOwnProperty('name')),
        tap(params => (this.header = params.name))
      )
      .subscribe(params => {
        this.store.dispatch(fromBookmarks.clearBookmarksOnTagFilter());
        this.store.dispatch(fromBookmarks.getBookmarksByTag());
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
