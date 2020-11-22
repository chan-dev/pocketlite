import { createAction, props } from '@ngrx/store';

import { Theme } from './ui.state';

export const updateTheme = createAction(
  '[HeaderComponent] Update Theme',
  props<{ theme: Theme }>()
);
export const updateThemeFromReaderViewPage = createAction(
  '[HeaderComponent] Update Theme From Reader View Page',
  props<{ theme: Theme }>()
);
export const updateThemeFromBrowserStorage = createAction(
  '[BrowserStorage] Update Theme From Browser Storage',
  props<{ theme: Theme }>()
);

export const updateThemeFromPreferColorSchemeMediaQuery = createAction(
  '[PreferColorScheme Media Query] Update Theme From Prefer Color Scheme Media Query',
  props<{ theme: Theme }>()
);
