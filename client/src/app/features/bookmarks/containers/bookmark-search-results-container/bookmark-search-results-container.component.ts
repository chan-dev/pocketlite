import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bookmark } from '@models/bookmark.model';
import * as fromSearch from '@app/features/bookmarks/state';
import { tap, skip } from 'rxjs/operators';

@Component({
  selector: 'app-bookmark-search-results-container',
  templateUrl: './bookmark-search-results-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkSearchResultsContainerComponent implements OnInit {
  private page = 1;
  bookmarks$: Observable<Bookmark[]>;

  constructor(private store: Store) {
    this.bookmarks$ = this.store.pipe(
      select(fromSearch.selectSearchResults),
      tap(_ => console.log('fetch search results'))
    );
  }

  ngOnInit() {
    this.store.dispatch(fromSearch.clearBookmarks());
    this.store.dispatch(fromSearch.searchBookmark());
  }
}
