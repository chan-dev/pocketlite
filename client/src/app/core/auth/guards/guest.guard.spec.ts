import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { User } from '../../types/user';
import { GuestGuard } from './guest.guard';
import { AuthService } from '../../services/auth.service';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let httpMock: HttpTestingController;

  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  const redirectUrl = '/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [
        GuestGuard,
        AuthService,
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });
    guard = TestBed.inject(GuestGuard);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow guest users and not redirect', () => {
    const fakeAuthService = {
      currentUser$: of<User | null>(null),
    };

    const localGuard = new GuestGuard(
      fakeAuthService as AuthService,
      routerSpy as Router
    );

    localGuard.canActivate().subscribe(isGuest => {
      expect(isGuest).toBe(true);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should redirect authenticated user to home page', () => {
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
    const localGuard = new GuestGuard(
      fakeAuthService as AuthService,
      routerSpy as Router
    );

    localGuard.canActivate().subscribe(isGuest => {
      console.log({ isGuest });
      expect(isGuest).toBe(false);
      expect(routerSpy.navigateByUrl).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });

  it('catch error and redirect to home page', () => {
    const url = 'http://localhost:3000/api/auth/user';

    guard.canActivate().subscribe(isGuest => {
      expect(isGuest).toBe(false);
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
