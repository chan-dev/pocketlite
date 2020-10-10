import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, catchError, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import * as fromAuth from '@app/core/auth/state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  private redirectUrl = '/auth/login';
  private isLoggedIn$: Observable<boolean>;
  constructor(private store: Store, private router: Router) {
    this.isLoggedIn$ = this.store.select(fromAuth.selectIsLoggedIn);
  }
  canLoad():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.canActivate();
  }

  canActivate() {
    return this.isLoggedIn$.pipe(
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl(this.redirectUrl);
          return false;
        }
        return true;
      }),
      take(1),
      catchError(() => {
        this.router.navigateByUrl(this.redirectUrl);
        return of(false);
      })
    );
  }
}
