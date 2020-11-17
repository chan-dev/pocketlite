import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorService } from '../error/error.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage: string;
        if (error instanceof HttpErrorResponse) {
          errorMessage =
            error.status === 504
              ? 'Cannot connect to server'
              : this.errorService.getServerError(error);
        } else {
          errorMessage = this.errorService.getClientError(error);
        }
        console.log({ errorMessage, error });
        return throwError(errorMessage);
      })
    );
  }
}
