import { createAction, props } from '@ngrx/store';

import { Theme } from './ui.state';

export const updateTheme = createAction(
  '[HeaderComponent] Update Theme',
  props<{ theme: Theme }>()
);
