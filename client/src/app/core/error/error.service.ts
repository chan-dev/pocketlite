import { Injectable, Injector } from '@angular/core';

import { RollbarService } from '../rollbar';
import * as Rollbar from 'rollbar';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private injector: Injector) {}

  // tslint:disable-next-line
  log(error: any): void {
    console.log('Logged by: ErrorService');
    const rollbar: Rollbar = this.injector.get(RollbarService);

    // TODO: check if date is included in rollbar logs
    rollbar.error(error.originalError || error);
  }
}
