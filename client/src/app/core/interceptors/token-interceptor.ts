import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { EMPTY, Observable, throwError } from 'rxjs';
import {
  catchError,
  switchMap,
  filter,
  take,
  shareReplay,
} from 'rxjs/operators';

import * as fromAuth from '@app/core/auth/state';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshInProgress = false;
  private isTokenRefreshed$: Observable<boolean | null>;

  constructor(private store: Store) {
    this.isTokenRefreshed$ = this.store.pipe(
      select(fromAuth.selectAuthIsTokenRefreshed),
      shareReplay(1)
    );
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // @ts-ignore
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handleAuthError(req, next);
        } else {
          return throwError(err);
        }
      })
    );
  }

  private handleAuthError(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshInProgress) {
      this.isRefreshInProgress = true;
      this.store.dispatch(fromAuth.refreshToken());

      // We can't use finalize operator here since it requires
      // observable completion
      //
      // this is a selector that we should keep listening
      // to it during the lifetime of the session, so we just have
      // to reset this.isRefreshing in two different places on
      // switchMap and catchError
      return this.isTokenRefreshed$.pipe(
        // we'll wait for the result of refreshToken action
        filter(refreshed => refreshed !== null),
        switchMap(refreshed => {
          if (refreshed) {
            this.isRefreshInProgress = false;
            return next.handle(req);
          }
          throw new Error('Token request error');
        }),
        catchError(() => {
          this.store.dispatch(fromAuth.forceLogout());
          this.isRefreshInProgress = false;
          return EMPTY;
        })
      );
    } else {
      // queued requests
      return this.isTokenRefreshed$.pipe(
        // only allow the last queued request
        take(1),
        switchMap(() => {
          return next.handle(req);
        })
      );
    }
  }
}
