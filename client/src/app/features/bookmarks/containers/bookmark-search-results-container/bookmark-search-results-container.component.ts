import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as fromBookmarks from '@app/features/bookmarks/state';
import * as fromRoot from '@app/core/core.state';

@Component({
  selector: 'app-bookmark-search-results-container',
  templateUrl: './bookmark-search-results-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkSearchResultsContainerComponent
  implements OnInit, OnDestroy {
  private subscription: Subscription;

  bookmarks$: Observable<Bookmark[]>;
  favorites$: Observable<BookmarkFavorite[]>;

  constructor(private store: Store) {
    this.bookmarks$ = combineLatest(
      this.store.pipe(select(fromBookmarks.selectBookmarksLoading)),
      this.store.pipe(select(fromBookmarks.selectCurrentBookmarks))
    ).pipe(
      filter(([loading, _]) => loading === false),
      map(([_, bookmarks]) => bookmarks)
    );

    this.favorites$ = this.store.pipe(select(fromBookmarks.selectFavorites));
  }

  ngOnInit() {
    this.subscription = this.store
      .pipe(
        select(fromRoot.selectQueryParams),
        filter(params => params.hasOwnProperty('query'))
      )
      .subscribe(params => {
        this.store.dispatch(fromBookmarks.clearBookmarksOnSearch());
        this.store.dispatch(fromBookmarks.searchBookmarks());
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
