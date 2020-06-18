import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { User } from '../types/user';

interface UserApiResponse {
  error: boolean;
  message: string;
  data?: {
    user: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$: Observable<User | null> = this.http
    .get<UserApiResponse>('http://localhost:3000/api/auth/user', {
      withCredentials: true,
    })
    .pipe(
      map(resp => resp.data.user),
      catchError((err: HttpErrorResponse) => {
        console.log({ err });
        return err.status === 401 ? of(null) : throwError(err);
      }),
      shareReplay(1)
    );

  constructor(private http: HttpClient) {}

  login() {
    const url = '/api/auth/google';
    return this.http.get(url).pipe(tap(result => console.log({ result })));
  }
}
