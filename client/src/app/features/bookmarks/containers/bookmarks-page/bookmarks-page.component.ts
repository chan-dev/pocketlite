import { Component, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import { LoadingState } from '../../state/reducers/bookmarks.reducer';

@Component({
  selector: 'app-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styles: [
    // NOTE: flexbox creates a new context so we have better
    // control on the child elements inside
    //
    // We need html and body to span 100% so this component
    // height's computation is relative to that height
    `
      :host {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        min-height: 0;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksPageComponent {
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.loading$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarkCallState),
      map((callState: LoadingState) => callState === LoadingState.LOADING)
    );
  }
}
