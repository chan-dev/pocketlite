import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import * as bookmarkActions from './bookmarks.actions';
import { BookmarksService } from '../services/bookmarks.service';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';

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

  deleteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.deleteBookmark),
      exhaustMap(({ id }) => {
        this.confirmDialogService.open({
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete?',
          cancelText: 'Cancel',
          confirmText: 'Delete',
        });

        return this.confirmDialogService.confirmed().pipe(
          map(confirm => {
            return confirm
              ? bookmarkActions.deleteConfirm({ id })
              : bookmarkActions.deleteCancel();
          })
        );
      })
    );
  });

  deleteConfirm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.deleteConfirm),
      exhaustMap(({ id }) =>
        this.bookmarksService.deleteBookmark(id).pipe(
          map(bookmarkId =>
            bookmarkActions.deleteBookmarkSuccess({ id: bookmarkId })
          ),
          catchError(error =>
            of(
              bookmarkActions.deleteBookmarkFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  deleteBookmarkSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.deleteBookmarkSuccess),
        tap(_ => {
          this.toastr.success('Bookmark has been deleted');
        })
      );
    },
    { dispatch: false }
  );

  deleteBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.deleteBookmarkFailure),
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
    private toastr: ToastrService,
    private confirmDialogService: ConfirmDialogService
  ) {}
}
