export const enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SEPIA = 'SEPIA',
}

export const enum ThemeClass {
  LIGHT = 'mode-light',
  DARK = 'mode-dark',
  SEPIA = 'mode-sepia',
}

export interface UiState {
  theme: Theme | null;
}
