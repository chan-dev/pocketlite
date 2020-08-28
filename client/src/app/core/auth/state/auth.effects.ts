import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import * as authActions from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  login$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.login),
        tap(() => this.store.dispatch(authActions.loginCallback()))
      );
    },
    { dispatch: false }
  );

  loginCallback$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.loginCallback),
      exhaustMap(() =>
        this.authService.currentUser$.pipe(
          map(currentUser => authActions.loginSuccess({ currentUser })),
          catchError(error => of(authActions.loginFailure({ error })))
        )
      )
    );
  });

  loginSuccessRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => this.router.navigate([this.authService.successRedirectUrl]))
      );
    },
    { dispatch: false }
  );

  loginErrorRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginFailure),
        tap(err => {
          console.error(err);
          this.router.navigate([this.authService.failureRedirectUrl]);
        })
      );
    },
    { dispatch: false }
  );

  // TODO: logout effects

  constructor(
    private router: Router,
    private store: Store<any>,
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
