import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { concatMap, map, shareReplay, withLatestFrom } from 'rxjs/operators';

import { Bookmark } from '@models/bookmark.model';
import { Tag } from '@models/tag.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import * as appSelectors from '@app/core/core.state';
import * as bookmarkSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as favoritesSelectors from '@app/features/bookmarks/state/selectors/favorites.selectors';
import * as favoritesActions from '@app/features/bookmarks/state/actions/favorites.actions';
import * as bookmarkActions from '@app/features/bookmarks/state/actions/bookmarks.actions';

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
  bookmarkFavorite$: Observable<BookmarkFavorite>;

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

    this.bookmarkFavorite$ = combineLatest([
      routerParam$,
      this.store.pipe(select(favoritesSelectors.selectFavorites)),
    ]).pipe(
      map(([params, favorites]) => {
        return favorites.find(favorite => favorite.bookmark_id === params.id);
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

  toggleFavoriteBookmark({
    bookmark,
    favorited,
  }: {
    bookmark: Bookmark;
    favorited: BookmarkFavorite;
  }) {
    if (favorited) {
      this.store.dispatch(
        favoritesActions.unfavoriteBookmarkInReaderPage({
          favorite: favorited,
        })
      );
    } else {
      this.store.dispatch(
        favoritesActions.favoriteBookmarkInReaderPage({ bookmark })
      );
    }
  }

  updateBookmarkTags(bookmark: Bookmark) {
    this.store.dispatch(
      bookmarkActions.openTagsModalInReaderPage({ bookmark })
    );
  }

  archiveBookmark(id: string) {
    this.store.dispatch(bookmarkActions.archiveBookmarkInReaderPage({ id }));
  }
}
