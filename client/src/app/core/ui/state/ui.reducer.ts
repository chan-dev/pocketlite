import {
  createReducer,
  Action,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import * as uiActions from './ui.actions';
import { UiState } from './ui.state';

export const initialState: UiState = {
  theme: null,
};

const uiReducer = createReducer(
  initialState,
  on(
    uiActions.updateTheme,
    uiActions.updateThemeFromBrowserStorage,
    uiActions.updateThemeFromPreferColorSchemeMediaQuery,
    (state, { theme }) => {
      return {
        ...state,
        theme,
      };
    }
  )
);

export function reducer(state: UiState | undefined, action: Action) {
  return uiReducer(state, action);
}

// Selectors
export const selectUiState = createFeatureSelector<UiState>('ui');
export const selectTheme = createSelector(selectUiState, state => state.theme);
