import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { User } from '@models/user.model';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let httpMock: HttpTestingController;

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  const redirectUrl = '/auth/login';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        AuthGuard,
        AuthService,
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow authenticated user and not redirect', () => {
    const user: User = {
      displayName: 'test',
      email: 'test@gmail.com',
      googleId: '1',
      id: '1',
      provider: 'google',
      thumbnail: 'test.jpg',
    };

    const fakeAuthService = {
      currentUser$: of<User | null>(user),
    };
    const localGuard = new AuthGuard(
      fakeAuthService as AuthService,
      routerSpy as Router
    );

    localGuard.canActivate().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(true);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should redirect to login route', () => {
    const fakeAuthService = {
      currentUser$: of<User | null>(null),
    };

    const localGuard = new AuthGuard(
      fakeAuthService as AuthService,
      routerSpy as Router
    );

    localGuard.canActivate().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(false);
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
    });
  });

  it('catch error and redirect to login page', () => {
    const url = 'http://localhost:3000/api/auth/user';

    guard.canActivate().subscribe(isLoggedIn => {
      expect(isLoggedIn).toBe(false);
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
    });

    // Response from API
    const jsonResponse = {
      error: true,
      message: 'Unexpected Server error',
    };

    // Http Error Response
    const serverResponseError = {
      status: 500,
      statusText: 'Server Error',
    };
    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush(jsonResponse, serverResponseError);

    httpMock.verify();
  });
});
