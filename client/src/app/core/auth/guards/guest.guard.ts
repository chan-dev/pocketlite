import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, catchError, take } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import * as fromAuth from '@app/core/auth/state';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate, CanLoad {
  private redirectUrl = '/';
  // private isLoggedIn$: Observable<boolean>;
  private isLoggedIn$ = this.store.select(fromAuth.selectIsLoggedIn);

  private isGuest$ = this.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
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

  constructor(private store: Store, private router: Router) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isGuest$;
  }

  canActivate(): Observable<boolean> {
    return this.isGuest$;
  }
}
