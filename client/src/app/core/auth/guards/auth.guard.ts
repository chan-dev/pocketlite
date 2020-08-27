import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private redirectUrl = '/auth/login';
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.currentUser$.pipe(
      map(user => !!user),
      map(isLoggedIn => {
        if (!isLoggedIn) {
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
  }
}
