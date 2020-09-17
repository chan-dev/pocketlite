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
  private isRefreshing = false;
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
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.store.dispatch(fromAuth.refreshToken());

      return this.isTokenRefreshed$.pipe(
        // we'll wait for the result of refreshToken action
        filter(refreshed => refreshed !== null),
        switchMap(refreshed => {
          if (refreshed) {
            return next.handle(req);
          }
          throw new Error('Token request error');
        }),
        catchError(() => {
          this.store.dispatch(fromAuth.forceLogout());
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
