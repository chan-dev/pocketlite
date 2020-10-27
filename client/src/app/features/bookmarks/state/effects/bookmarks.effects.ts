import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of, iif } from 'rxjs';
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
  switchMap,
} from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

import { Bookmark } from '@models/bookmark.model';
import * as appState from '@app/core/core.state';
import * as bookmarkActions from '../actions/bookmarks.actions';
import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';
import * as tagsSelectors from '@app/features/bookmarks/state/selectors/tags.selectors';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import { BookmarksService } from '../../services/bookmarks.service';
import { TagsModalComponent } from '../../components/tags-modal/tags-modal.component';

@Injectable()
export class BookmarkEffects {
  getBookmarkItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.getBookmarkItems),
      // we use concatMap since they should be in order
      // for pagination
      mergeMap(({ page, limit }) =>
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
          mergeMap(bookmark => {
            return of(bookmark).pipe(
              withLatestFrom(
                this.store.pipe(select(appState.selectRouteUrl)),
                (_, currentUrl) => currentUrl
              ),
              map(currentUrl => {
                // When saving a new bookmark, only add the newly saved
                // bookmark if we're on the /bookmarks page w/c is the default
                // route
                if (currentUrl === '/bookmarks') {
                  return bookmarkActions.saveBookmarkSuccess({ bookmark });
                }
                return bookmarkActions.noOpAction();
              })
            );
          }),
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
        ofType(bookmarkActions.noOpAction),
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

  restoreBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.restoreBookmark),
      exhaustMap(({ id }) =>
        this.bookmarksService.restoreBookmark(id).pipe(
          map(bookmark => {
            const updatedBookmark: Update<Bookmark> = {
              id,
              changes: {
                deleted: false,
              },
            };
            return bookmarkActions.restoreBookmarkSuccess({
              bookmark: updatedBookmark,
            });
          }),
          catchError(error =>
            of(
              bookmarkActions.restoreBookmarkFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  restoreBookmarkSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.restoreBookmarkSuccess),
        tap(_ => {
          this.toastr.success('Bookmark has been restored');
        })
      );
    },
    { dispatch: false }
  );

  restoreBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.restoreBookmarkFailure),
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
      mergeMap(action => {
        return of(action).pipe(
          // TODO: reuse, create a reusable operator
          withLatestFrom(
            this.store.pipe(select(appState.selectQueryParams)),
            (_, queryParams) => {
              return queryParams;
            }
          )
        );
      }),
      // NOTE: this doesn't run after 2nd search
      mergeMap(queryParams => {
        return this.bookmarksService.searchBookmarks(queryParams.query).pipe(
          map(bookmarks =>
            bookmarkActions.searchBookmarksSuccess({ bookmarks })
          ),
          catchError(error =>
            of(
              bookmarkActions.searchBookmarksFailure({
                error: error?.error?.message,
              })
            )
          )
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
        return this.bookmarksService.getArchivedBookmarks().pipe(
          map(bookmarks =>
            bookmarkActions.getArchivedBookmarksSuccess({ bookmarks })
          ),
          catchError(error =>
            of(
              bookmarkActions.getArchivedBookmarksFailure({
                error: error?.error?.message,
              })
            )
          )
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

  getFavoritedBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.getFavoritedBookmarks),
      mergeMap(queryParams => {
        return this.bookmarksService.getFavoritedBookmarks().pipe(
          map(bookmarks =>
            bookmarkActions.getFavoritedBookmarksSuccess({ bookmarks })
          ),
          catchError(error =>
            of(
              bookmarkActions.getFavoritedBookmarksFailure({
                error: error?.error?.message,
              })
            )
          )
        );
      })
    );
  });

  getFavoritedBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.getFavoritedBookmarksFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  getBookmarksByTag$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.getBookmarksByTag),
      mergeMap(action => {
        return of(action).pipe(
          // TODO: reuse, create a reusable operator
          withLatestFrom(
            this.store.pipe(select(appState.selectRouteParams)),
            (_, params) => {
              return params;
            }
          )
        );
      }),
      mergeMap(params => {
        return this.bookmarksService.getBookmarksByTag(params.name).pipe(
          map(bookmarks =>
            bookmarkActions.getBookmarksByTagSuccess({ bookmarks })
          ),
          catchError(error =>
            of(
              bookmarkActions.getBookmarksByTagFailure({
                error: error?.error?.message,
              })
            )
          )
        );
      })
    );
  });

  getBookmarksByTagFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(bookmarkActions.getBookmarksByTagFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  openTagsModal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        bookmarkActions.openTagsModal,
        bookmarkActions.openTagsModalInReaderPage
      ),
      switchMap(({ bookmark }) => {
        return of(bookmark).pipe(
          withLatestFrom(
            this.store.pipe(select(tagsSelectors.selectTags)),
            this.store.pipe(
              select(bookmarksSelectors.selectBookmarkTags(bookmark.id))
            )
          )
        );
      }),
      exhaustMap(([bookmark, tags, bookmarkTags]) => {
        const allTagNames = tags.map(tag => tag.name);
        const bookmarkTagNames = bookmarkTags.map(tag => tag.name);

        const dialogRef = this.dialog.open(TagsModalComponent, {
          panelClass: 'full-width-dialog',
          ariaLabel: 'tags modal',
          data: {
            bookmarkTags: bookmarkTagNames || [],
            allTags: allTagNames || [],
          },
        });

        return dialogRef.afterClosed().pipe(
          map(selectedTags => {
            return selectedTags
              ? bookmarkActions.updateBookmarkTags({
                  bookmarkId: bookmark.id,
                  selectedTags,
                })
              : bookmarkActions.closeTagsModal();
          })
        );
      })
    );
  });

  updateBookmarkTags$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.updateBookmarkTags),
      mergeMap(({ bookmarkId, selectedTags }) => {
        return this.bookmarksService
          .updateBookmarkTags(bookmarkId, selectedTags)
          .pipe(
            map(resp => {
              const updatedBookmark: Update<Bookmark> = {
                id: resp.bookmark.id,
                changes: {
                  tags: [...resp.bookmark.tags],
                },
              };
              return bookmarkActions.updateBookmarkTagsSuccess({
                bookmark: updatedBookmark,
                newTags: resp.newTags,
              });
            }),
            catchError(error =>
              of(
                bookmarkActions.updateBookmarkTagsFailure({
                  error: error?.error?.message,
                })
              )
            )
          );
      })
    );
  });

  selectOrLoadBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(bookmarkActions.selectOrLoadBookmark),
      switchMap(({ id }) => {
        return of(id).pipe(
          withLatestFrom(
            this.store.select(bookmarksSelectors.selectCurrentBookmark(id))
          )
        );
      }),
      switchMap(([id, bookmarkInStore]) => {
        const bookmarkFromApi$ = this.bookmarksService.getBookmark(id).pipe(
          map(({ bookmark }) => {
            return bookmarkActions.loadBookmarkFromApiSuccess({
              bookmark,
            });
          }),
          catchError(error =>
            of(
              bookmarkActions.loadBookmarkFromApiFailure({
                error: error?.error?.message,
              })
            )
          )
        );

        const bookmarkFromStore = bookmarkActions.selectBookmarkInStoreSuccess({
          bookmark: bookmarkInStore,
        });

        return iif(
          () => !!bookmarkInStore,
          of(bookmarkFromStore),
          bookmarkFromApi$
        );
      })
    );
  });

  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private toastr: ToastrService,
    private bookmarksService: BookmarksService,
    private confirmDialogService: ConfirmDialogService,
    private dialog: MatDialog
  ) {}
}
