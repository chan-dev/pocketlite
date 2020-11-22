import { ThemeRadioPickerOption } from '@app/features/bookmarks/shared/components/theme-picker-control/theme-radio-picker-option.interface';

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

export const AVAILABLE_THEMES: ThemeRadioPickerOption[] = [
  {
    label: 'Light',
    value: Theme.LIGHT,
    color: '#fff',
  },
  {
    label: 'Dark',
    value: Theme.DARK,
    color: '#000',
  },
  {
    label: 'Sepia',
    value: Theme.SEPIA,
    color: '#f5eddd',
  },
];
