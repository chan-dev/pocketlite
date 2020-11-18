export const enum Theme {
  DARK = 'DARK',
  SEPIA = 'SEPIA',
}

export const enum ThemeClass {
  DARK = 'mode-dark',
  SEPIA = 'mode-sepia',
}

export interface UiState {
  theme: Theme | null;
}
