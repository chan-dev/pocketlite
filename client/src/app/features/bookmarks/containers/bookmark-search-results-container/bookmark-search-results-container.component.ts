import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of, Subscription } from 'rxjs';
import { filter, withLatestFrom, concatMap } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import * as fromSearch from '@app/features/bookmarks/state';
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

  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(fromSearch.selectSearchLoading),
      filter(loading => loading === false),
      concatMap(loading =>
        of(loading).pipe(
          withLatestFrom(
            this.store.select(fromSearch.selectSearchResults),
            (_, bookmarks) => {
              return bookmarks;
            }
          )
        )
      )
    );
  }

  ngOnInit() {
    this.subscription = this.store
      .pipe(
        select(fromRoot.selectQueryParams),
        filter(params => params.hasOwnProperty('query'))
      )
      .subscribe(params => {
        this.store.dispatch(fromSearch.clearBookmarks());
        this.store.dispatch(fromSearch.searchBookmark());
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
