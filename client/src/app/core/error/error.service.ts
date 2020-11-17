import { Injectable, Injector } from '@angular/core';

import { RollbarService } from '../rollbar';
import * as Rollbar from 'rollbar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private injector: Injector) {}

  // tslint:disable-next-line
  log(error: any): void {
    const rollbar: Rollbar = this.injector.get(RollbarService);

    // TODO: check if date is included in rollbar logs
    rollbar.error(error.originalError || error);
  }

  getClientError(error: Error) {
    return error.message;
  }

  getServerError(error: HttpErrorResponse) {
    return error.error.message;
  }
}
