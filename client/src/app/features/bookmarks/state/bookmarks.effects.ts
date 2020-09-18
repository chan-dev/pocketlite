import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import {
  tap,
  exhaustMap,
  map,
  catchError,
  withLatestFrom,
  concatMap,
  mergeMap,
} from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { Bookmark } from '@models/bookmark.model';
import * as appState from '@app/core/core.state';
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
      // we use concatMap since they should be in order
      // for pagination
      concatMap(({ page, limit }) =>
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

  archiveBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.archiveBookmark),
      exhaustMap(({ id }) =>
        this.bookmarksService.archiveBookmark(id).pipe(
          map(bookmark => {
            const updatedBookmark: Update<Bookmark> = {
              id,
              changes: {
                deleted: true,
              },
            };
            return bookmarkActions.archiveBookmarkSuccess({
              bookmark: updatedBookmark,
            });
          }),
          catchError(error =>
            of(
              bookmarkActions.archiveBookmarkFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  archiveBookmarkSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.archiveBookmarkSuccess),
        tap(_ => {
          this.toastr.success('Bookmark has been archived');
        })
      );
    },
    { dispatch: false }
  );

  archiveBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.archiveBookmarkFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  startSearch$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.startSearch),
        tap(({ query }) => {
          this.router.navigate(['/bookmarks/search'], {
            queryParamsHandling: 'merge',
            queryParams: {
              query,
            },
          });
        })
      );
    },
    { dispatch: false }
  );

  searchBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.searchBookmarks),
      tap(_ => console.log('searchBookmark$ runs 🔖')),
      // NOTE: changing exhaustMap to mergeMap fixes our problem
      mergeMap(action => {
        return of(action).pipe(
          // TODO: reuse, create a reusable operator
          withLatestFrom(
            this.store.pipe(select(appState.selectQueryParams)),
            (_, queryParams) => {
              console.log('withLatestFrom runs');
              return queryParams;
            }
          )
        );
      }),
      // tap(queryParams => console.log({ queryParams })),
      // NOTE: this doesn't run after 2nd search
      mergeMap(queryParams => {
        console.log('exhaustMap');
        return this.bookmarksService.searchBookmarks(queryParams.query).pipe(
          // TODO: check if this happens after interceptor
          tap(_ => console.log('searchBookmark$ http request started 🔖')),
          map(bookmarks =>
            bookmarkActions.searchBookmarksSuccess({ bookmarks })
          ),
          catchError(error =>
            of(
              bookmarkActions.searchBookmarksFailure({
                error: error?.error?.message,
              })
            )
          ),
          tap(value => console.log('searchBookmark$ has finished'))
        );
      })
    );
  });

  searchBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.searchBookmarksFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  getArchivedBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.getArchivedBookmarks),
      mergeMap(queryParams => {
        console.log('exhaustMap');
        return this.bookmarksService.getArchivedBookmarks().pipe(
          // TODO: check if this happens after interceptor
          tap(_ => console.log('getArchivedBookmark$ http request started 🔖')),
          map(bookmarks =>
            bookmarkActions.getArchivedBookmarksSuccess({ bookmarks })
          ),
          catchError(error =>
            of(
              bookmarkActions.getArchivedBookmarksFailure({
                error: error?.error?.message,
              })
            )
          ),
          tap(value => console.log('getArchivedBookmark$ has finished'))
        );
      })
    );
  });

  getArchivedBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.getArchivedBookmarksFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private toastr: ToastrService,
    private bookmarksService: BookmarksService,
    private confirmDialogService: ConfirmDialogService
  ) {}
}
