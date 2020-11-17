import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, merge, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  take,
  mapTo,
  tap,
  withLatestFrom,
  switchMap,
  filter,
} from 'rxjs/operators';

import { LoadingState } from '../state/reducers/bookmarks.reducer';
import * as bookmarkActions from '@app/features/bookmarks/state/actions/bookmarks.actions';
import * as bookmarksSelectors from '@app/features/bookmarks/state/selectors/bookmarks.selectors';

@Injectable({
  providedIn: 'root',
})
export class BookmarkMustExistGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  isFound(id: string) {
    const isLoaded$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarkCallState),
      filter(callState => callState === LoadingState.LOADED)
    );

    return isLoaded$.pipe(
      switchMap(loaded => {
        return of(loaded).pipe(
          withLatestFrom(
            this.store.pipe(
              select(bookmarksSelectors.selectCurrentBookmark(id))
            ),
            (_, currentBookmark) => currentBookmark
          )
        );
      })
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const bookmarkId = route.params.id;

    this.store.dispatch(
      bookmarkActions.selectOrLoadBookmark({ id: bookmarkId })
    );

    const isFound$ = this.isFound(bookmarkId).pipe(mapTo(true));

    const error$ = this.store.pipe(
      select(bookmarksSelectors.selectBookmarksError),
      // required, since selectors emit initial value of state
      filter(err => !!err),
      mapTo(false)
    );

    return merge(isFound$, error$).pipe(
      tap(value => {
        if (!value) {
          this.router.navigate(['/not-found']);
        }
      }),
      take(1)
    );
  }
}
