import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import * as searchActions from './search.actions';
import { BookmarksService } from '../services/bookmarks.service';

@Injectable({
  providedIn: 'root',
})
export class SearchEffects {
  searchBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(searchActions.searchBookmark),
      exhaustMap(({ query }) =>
        this.bookmarksService.searchBookmarks(query).pipe(
          map(bookmarks => searchActions.searchBookmarkSuccess({ bookmarks })),
          catchError(error =>
            of(
              searchActions.searchBookmarkFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  searchBookmarkSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(searchActions.searchBookmarkSuccess),
        tap(_ => {
          this.router.navigate(['/bookmarks/search'], {
            queryParamsHandling: 'merge',
          });
        })
      );
    },
    { dispatch: false }
  );

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
    private bookmarksService: BookmarksService,
    private toastr: ToastrService
  ) {}
}
