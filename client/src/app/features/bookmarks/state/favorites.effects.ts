import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { tap, map, catchError, mergeMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import * as favoriteActions from './favorites.actions';
import { BookmarksService } from '../services/bookmarks.service';

@Injectable()
export class FavoriteEffects {
  getFavorites$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(favoriteActions.getFavorites),
      mergeMap(() =>
        this.bookmarksService.getBookmarkFavorited().pipe(
          map(favorites => favoriteActions.getFavoritesSuccess({ favorites })),
          catchError(error =>
            of(
              favoriteActions.getFavoritesFailure({
                error: error?.error?.message,
              })
            )
          )
        )
      )
    );
  });

  getFavoritesFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(favoriteActions.getFavoritesFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private toastr: ToastrService,
    private bookmarksService: BookmarksService
  ) {}

  ngrxOnInitEffects(): Action {
    // BookmarksModule is a featuremodule that's only
    // loaded once user has been authenticated, so it's say to
    // dispatch an action to query the current user's favorited bookmarks
    return favoriteActions.getFavorites();
  }
}
