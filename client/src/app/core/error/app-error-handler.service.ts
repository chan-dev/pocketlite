import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorService } from './error.service';

@Injectable()
export class AppErrorHandlerService extends ErrorHandler {
  // we used Injector since ErrorHandler is created
  // before providers so we don't have access to dependencies
  constructor(private injector: Injector) {
    super();
  }

  // ts-lint: disable-next-line
  handleError(error: HttpErrorResponse | ErrorEvent) {
    // notify to rollbar
    const errorService = this.injector.get(ErrorService);
    const errorMessage = error?.error?.message ?? error.message;

    if (error instanceof HttpErrorResponse) {
      console.log('server error');
    } else {
      console.log('client error');
      // redirect to error component
    }

    errorService.log(error);
    console.error(error);
  }
}
