import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { User } from '@models/user.model';

interface UserApiResponse {
  error: boolean;
  message: string;
  data?: {
    user: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  successRedirectUrl = '/';
  failureRedirectUrl = '/auth/login';

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
      .get<UserApiResponse>('http://localhost:3000/api/auth/user', {
        withCredentials: true,
        headers,
      })
      .pipe(
        map(resp => resp.data.user),
        catchError((err: HttpErrorResponse) => {
          console.log({ err });
          return err.status === 401 ? of(null) : throwError(err);
        }),
        // TODO: should we remove this since only AuthEffect will use this
        shareReplay(1)
      );
  }
}
