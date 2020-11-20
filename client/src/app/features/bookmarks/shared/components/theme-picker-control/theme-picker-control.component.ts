import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Theme } from '@app/core/ui/state';
import { Subscription } from 'rxjs';

import { ThemeRadioPickerOption } from './theme-radio-picker-option.interface';

@Component({
  selector: 'app-theme-picker-control',
  templateUrl: './theme-picker-control.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerControlComponent
  implements OnInit, OnChanges, OnDestroy {
  private themePickerSub: Subscription;

  @Input() activeTheme: Theme;
  @Input() themes: ThemeRadioPickerOption[];
  @Output() controlValueChanges = new EventEmitter<ThemeRadioPickerOption>();

  themePicker = new FormControl({
    value: null,
    disabled: false,
  });

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const activeTheme = changes?.activeTheme;

    if (activeTheme.currentValue) {
      this.updateActiveOnLoadOrPrefersColorSchemeQuery(
        activeTheme.currentValue
      );
    }
  }

  ngOnInit() {
    this.themePickerSub = this.themePicker.valueChanges.subscribe(
      (theme: ThemeRadioPickerOption) => {
        this.controlValueChanges.emit(theme);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.themePickerSub) {
      this.themePickerSub.unsubscribe();
    }
  }

  private updateActiveOnLoadOrPrefersColorSchemeQuery(theme: Theme) {
    let savedTheme: ThemeRadioPickerOption;

    savedTheme =
      this.themes?.length &&
      this.themes.find(t => (t.value as Theme) === theme);

    this.themePicker.setValue(savedTheme, {
      // NOTE: we must set this to false so
      // valueChanges/statusChanges won't emit for this formControl
      //
      //
      // the reason we only intend to set the current item on
      // themePicker formControl on page load or whenever
      // prefers-color-scheme user preference changes AND tell
      // Angular NOT to emit valueChanges/statusChanges since the logic
      // is already handled by ThemeService.checkThemeOnLoad()
      //
      // setting this value is meant only to update the active css class
      // of the currently selected theme
      emitEvent: false,
    });
  }
}
