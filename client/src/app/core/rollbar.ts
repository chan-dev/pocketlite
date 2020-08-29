import { InjectionToken } from '@angular/core';

import * as Rollbar from 'rollbar';

import { environment } from '../../environments/environment.prod';

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

export const rollbarFactory = (): Rollbar => {
  return new Rollbar(environment.rollbarConfig);
};
