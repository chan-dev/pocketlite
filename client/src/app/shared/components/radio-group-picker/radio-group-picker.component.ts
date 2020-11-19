import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  forwardRef,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { RadioGroupPickerDirective } from './radio-group-picker.directive';

export interface RadioGroupPickerOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-radio-group-picker',
  templateUrl: './radio-group-picker.component.html',
  styleUrls: ['./radio-group-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupPickerComponent),
      multi: true,
    },
  ],
})
export class RadioGroupPickerComponent implements ControlValueAccessor, OnInit {
  @Input() items!: RadioGroupPickerOption[];
  @Input() label!: string;
  @Input() ariaLabel!: string;
  @Input() styleClass!: string;
  @ContentChild(RadioGroupPickerDirective, { read: TemplateRef })
  itemTemplate!: TemplateRef<RadioGroupPickerDirective>;
  @ViewChildren('customRadioItem') customRadioItems!: QueryList<ElementRef>;

  selectedItem!: RadioGroupPickerOption;
  isDisabled!: boolean;
  onChangeFn!: (item: RadioGroupPickerOption) => void;
  onTouchedFn!: () => void;

  constructor() {}

  ngOnInit(): void {}

  writeValue(item: RadioGroupPickerOption): void {
    this.selectedItem = item;
  }

  registerOnChange(fn: () => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  setSelectedItem(item: RadioGroupPickerOption): void {
    if (!this.isDisabled) {
      this.selectedItem = item;
      this.onChangeFn(item);
      this.onTouchedFn();
    }
  }

  move(event: KeyboardEvent, index: number): void {
    const { code } = event;
    if (code === 'ArrowUp' || code === 'ArrowLeft') {
      this.prevItem(index);
    } else if (code === 'ArrowDown' || code === 'ArrowRight') {
      this.nextItem(index);
    }
  }

  private nextItem(index: number): void {
    if (index === this.items.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }

    const selectedItem = this.items[index];
    this.setSelectedItem(selectedItem);
    this.moveFocus(index);
  }

  private prevItem(index: number): void {
    if (index === 0) {
      index = this.items.length - 1;
    } else {
      index = index - 1;
    }

    const selectedItem = this.items[index];
    this.setSelectedItem(selectedItem);
    this.moveFocus(index);
  }

  private moveFocus(index: number): void {
    this.customRadioItems.toArray()[index].nativeElement.focus();
  }
}
