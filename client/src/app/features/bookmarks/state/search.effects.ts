import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  tap,
  exhaustMap,
  map,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';
import * as appState from '@app/core/core.state';

import { Store, select } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

import * as searchActions from './search.actions';
import { BookmarksService } from '../services/bookmarks.service';

@Injectable({
  providedIn: 'root',
})
export class SearchEffects {
  startSearch$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(searchActions.startSearch),
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
      ofType(searchActions.searchBookmark),
      exhaustMap(action => {
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
      tap(queryParams => console.log({ queryParams })),
      exhaustMap(queryParams => {
        return this.bookmarksService.searchBookmarks(queryParams.query).pipe(
          map(bookmarks => searchActions.searchBookmarkSuccess({ bookmarks })),
          catchError(error =>
            of(
              searchActions.searchBookmarkFailure({
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
        ofType(searchActions.searchBookmarkFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store,
    private bookmarksService: BookmarksService,
    private toastr: ToastrService
  ) {}
}
