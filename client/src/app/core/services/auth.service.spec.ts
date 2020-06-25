import {
  HttpEvent,
  HttpEventType,
  HttpErrorResponse,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { User } from '@models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:3000/api/auth/user';
  const dummyApiResponse = {
    error: false,
    message: 'Authentication test ok',
    data: {
      user: {
        id: '1',
        displayName: 'test',
        googleId: 'test',
        email: 'test@gmail.com',
        thumbnail: 'test.jpg',
        provider: 'google',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch current user', () => {
    service.currentUser$.subscribe(user => {
      expect(user.displayName).toBe('test');
      expect(user).toBe(dummyApiResponse.data.user as User);
    });

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush(dummyApiResponse);
  });

  it('should map 401 error to null value', () => {
    // Response returned from API
    const jsonResponse = {
      error: true,
      message: 'Authentication Error',
    };

    // Http Error Response
    const serverResponseError = {
      status: 401,
      statusText: 'Unauthenticated',
    };

    service.currentUser$.subscribe(
      // successfully caught error and map it to "null"
      res => {
        console.log('success response');
        expect(res).toBe(null);
      },
      (err: HttpErrorResponse) => {
        // this won't execute since in AuthService we caught 401 error
        // and map them to 'null' value
        console.log('error response');
        expect(err.status).toBe(401);
      }
    );

    const request = httpMock.expectOne(url);
    request.flush(jsonResponse, serverResponseError);
  });

  it('should rethrow error on all errors EXCEPT 401 errors', () => {
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

    service.currentUser$.subscribe(
      res => fail('should have failed here'),
      (err: HttpErrorResponse) => {
        console.log('error response');
        expect(err.status).toBe(500);
        expect(err.error).toEqual(jsonResponse);
        expect(err.error.message).toEqual(jsonResponse.message);
      }
    );

    const request = httpMock.expectOne(url);
    request.flush(jsonResponse, serverResponseError);
  });
});
