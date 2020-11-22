import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { createEffect, ofType, Actions } from '@ngrx/effects';

import * as uiActions from './ui.actions';
import { ThemeService } from '../services/theme.service';

@Injectable()
export class UiEffects {
  getTagItems$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          uiActions.updateTheme,
          uiActions.updateThemeFromBrowserStorage,
          uiActions.updateThemeFromPreferColorSchemeMediaQuery,
          uiActions.updateThemeFromReaderViewPage
        ),
        tap(({ theme }) => {
          this.uiService.updateTheme(theme);
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private uiService: ThemeService) {}
}
