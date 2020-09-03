import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import * as bookmarkActions from './bookmarks.actions';
import { BookmarksService } from '../services/bookmarks.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarkEffects {
  getBookmarkItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.getBookmarkItems),
      exhaustMap(({ page, limit }) =>
        this.bookmarksService.fetchBookmarks(page, limit).pipe(
          map(bookmarks => bookmarkActions.loadBookmarksSuccess({ bookmarks })),
          catchError(error =>
            of(
              bookmarkActions.loadBookmarksFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  saveBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.saveBookmark),
      exhaustMap(({ url }) =>
        this.bookmarksService.saveBookmark(url).pipe(
          map(bookmark => bookmarkActions.saveBookmarkSuccess({ bookmark })),
          catchError(error =>
            of(
              bookmarkActions.saveBookmarkFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  saveBookmarkSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.saveBookmarkSuccess),
        tap(_ => {
          this.toastr.success('Bookmark has been saved');
        })
      );
    },
    { dispatch: false }
  );

  saveBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.saveBookmarkFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private bookmarksService: BookmarksService,
    private toastr: ToastrService
  ) {}
}
