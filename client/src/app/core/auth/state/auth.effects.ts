import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { tap, exhaustMap, map, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import * as authActions from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  private redirects = {
    login: {
      success: '/',
      failure: '/auth/login',
    },
    logout: {
      success: '/auth/login',
      failure: '/',
    },
  };
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
          catchError(error =>
            of(authActions.loginFailure({ error: error?.error?.message }))
          )
        )
      )
    );
  });

  loginSuccessRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginSuccess),
        tap(() => this.router.navigate([this.redirects.login.success]))
      );
    },
    { dispatch: false }
  );

  loginErrorRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.loginFailure),
        tap(error => {
          console.error(error);
          this.router.navigate([this.redirects.login.failure]);
        })
      );
    },
    { dispatch: false }
  );

  // TODO: logout effects
  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.logout),
      exhaustMap(() => {
        this.confirmDialogService.open({
          title: 'Confirm Logout',
          message: 'Are you sure you want to logout?',
          cancelText: 'Cancel',
          confirmText: 'Logout',
        });

        return this.confirmDialogService.confirmed().pipe(
          map(confirm => {
            return confirm
              ? authActions.logoutConfirm()
              : authActions.logoutCancel();
          })
        );
      })
    );
  });

  logoutConfirm$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.logoutConfirm),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => authActions.logoutSuccess()),
          catchError(error => of(authActions.logoutFailure({ error })))
        )
      )
    );
  });

  logoutSuccessRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logoutSuccess),
        tap(() => this.router.navigate([this.redirects.logout.success]))
      );
    },
    { dispatch: false }
  );

  logoutFailureRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(authActions.logoutFailure),
        tap(error => {
          console.error(error);
          this.router.navigate([this.redirects.logout.failure]);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private router: Router,
    private store: Store<any>,
    private actions$: Actions,
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService
  ) {}
}
