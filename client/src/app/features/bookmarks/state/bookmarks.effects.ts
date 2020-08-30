import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

// import { AuthService } from '../services/auth.service';
// import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
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
            of(bookmarkActions.loadBookmarksFailure({ error }))
          )
        )
      )
    );
  });

  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private bookmarksService: BookmarksService
  ) {}
}
