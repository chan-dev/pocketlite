import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { User } from '@models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$: Observable<User | null> = this.fetchCurrentUser();

  constructor(private http: HttpClient) {}

  login() {
    // oauth2 login
    const url = '/api/auth/google';
    return this.http.get(url).pipe(tap(result => console.log({ result })));
  }

  private fetchCurrentUser() {
    // BUG: we have to disable caching because there's a bug
    // that caches requests when we press the back button while
    // login on google
    const headers = new HttpHeaders()
      .set('Cache-Control', 'no-cache')
      .append('Pragma', 'no-cache');

    return this.http
      .get<{ user: User }>('/api/auth/user', {
        withCredentials: true,
        headers,
      })
      .pipe(
        map(resp => resp.user),
        catchError((err: HttpErrorResponse) => {
          return err.status === 401 ? of(null) : throwError(err);
        }),
        // TODO: should we remove this since only AuthEffect will use this
        shareReplay(1)
      );
  }

  logout() {
    // will be redirected by proxy to localhost:3000/api/auth/logout
    return this.http.post('/api/auth/logout', {});
  }

  refreshToken() {
    return this.http.post<{ token: string }>('/api/auth/refresh', {});
  }
}
