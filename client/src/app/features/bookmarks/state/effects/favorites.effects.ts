import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { tap, map, catchError, mergeMap, switchMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import * as favoriteActions from '../actions/favorites.actions';
import { BookmarksService } from '../../services/bookmarks.service';
import { generateFavoriteIdForAdapter } from '../reducers/favorites.reducer';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';

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
                error,
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

  favoriteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        favoriteActions.favoriteBookmark,
        favoriteActions.favoriteBookmarkInReaderPage
      ),
      mergeMap(({ bookmark }) =>
        this.bookmarksService.favoriteBookmark(bookmark.id).pipe(
          map(favorite => {
            const favoriteUpdate: Update<BookmarkFavorite> = {
              // this id is used for EntityAdapter's selectId
              id: generateFavoriteIdForAdapter(favorite),
              changes: {
                // this one is the state
                id: favorite.id,
              },
            };
            return favoriteActions.favoriteBookmarkSuccess({
              favorite: favoriteUpdate,
            });
          }),
          catchError(error =>
            of(
              favoriteActions.favoriteBookmarkFailure({
                error,
                bookmark,
              })
            )
          )
        )
      )
    );
  });

  favoriteBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(favoriteActions.favoriteBookmarkFailure),
        tap(error => {
          this.toastr.error(error.error);
        })
      );
    },
    { dispatch: false }
  );

  unfavoriteBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        favoriteActions.unfavoriteBookmark,
        favoriteActions.unfavoriteBookmarkInReaderPage
      ),
      mergeMap(({ favorite }) =>
        this.bookmarksService.unfavoriteBookmark(favorite.id).pipe(
          map(_ => favoriteActions.unfavoriteBookmarkSuccess()),
          catchError(error =>
            of(
              favoriteActions.unfavoriteBookmarkFailure({
                error,
                favorite,
              })
            )
          )
        )
      )
    );
  });

  unfavoriteBookmarkFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(favoriteActions.unfavoriteBookmarkFailure),
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
