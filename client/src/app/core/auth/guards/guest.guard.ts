import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route,
} from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate, CanLoad {
  private redirectUrl = '/';
  private isGuest$ = this.authService.currentUser$.pipe(
    map(user => !!user),
    map(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigateByUrl(this.redirectUrl);
        return false;
      }
      return true;
    }),
    catchError((err: HttpErrorResponse) => {
      this.router.navigateByUrl(this.redirectUrl);
      return of(false);
    })
  );

  constructor(private authService: AuthService, private router: Router) {}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.isGuest$;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isGuest$;
  }
}
