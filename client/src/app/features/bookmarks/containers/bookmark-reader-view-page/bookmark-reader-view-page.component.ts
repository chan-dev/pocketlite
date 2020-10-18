import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { concatMap, shareReplay, withLatestFrom } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import { Tag } from '@models/tag.model';
import * as appSelectors from '@app/core/core.state';
import * as bookmarkSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';

@Component({
  selector: 'app-bookmark-reader-view-page',
  templateUrl: './bookmark-reader-view-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkReaderViewPageComponent implements OnInit {
  private relativeScrollSubject = new Subject<number>();

  bookmark$: Observable<Bookmark>;
  bookmarkTags$: Observable<Tag[]>;
  isFavorited$: Observable<boolean>;

  relativeScrollPosition$ = this.relativeScrollSubject.asObservable();

  constructor(private store: Store) {}

  ngOnInit() {
    const routerParam$ = this.store.pipe(
      select(appSelectors.selectRouteParams),
      shareReplay(1)
    );

    // we require the parameter id from store
    this.bookmark$ = routerParam$.pipe(
      concatMap(params => {
        return of(params).pipe(
          withLatestFrom(
            this.store.pipe(
              select(bookmarkSelectors.selectCurrentBookmark(params.id))
            ),
            (_, bookmark) => bookmark
          )
        );
      })
    );

    this.bookmarkTags$ = routerParam$.pipe(
      concatMap(params => {
        return of(params).pipe(
          withLatestFrom(
            this.store.pipe(
              select(bookmarkSelectors.selectBookmarkTags(params.id))
            ),
            (_, tags) => tags
          )
        );
      })
    );

    this.isFavorited$ = routerParam$.pipe(
      concatMap(params => {
        return of(params).pipe(
          withLatestFrom(
            this.store.pipe(
              select(bookmarkSelectors.selectIfBookmarkFavorited(params.id))
            ),
            (_, isFavorited) => isFavorited
          )
        );
      })
    );
  }

  @HostListener('window:scroll', [])
  windowScroll() {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    const unscrolledArea = scrollHeight - clientHeight;
    const relativeScrollPosition = (scrollTop / unscrolledArea) * 100;
    this.relativeScrollSubject.next(relativeScrollPosition);
  }
}
