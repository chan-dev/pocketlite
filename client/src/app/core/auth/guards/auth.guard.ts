import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, catchError, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import * as fromAuth from '@app/core/auth/state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private redirectUrl = '/auth/login';
  private isLoggedIn$: Observable<boolean>;
  constructor(private store: Store, private router: Router) {
    this.isLoggedIn$ = this.store.select(fromAuth.selectIsLoggedIn);
  }

  canActivate() {
    return this.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigateByUrl(this.redirectUrl);
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigateByUrl(this.redirectUrl);
        return of(false);
      })
    );
  }
}
