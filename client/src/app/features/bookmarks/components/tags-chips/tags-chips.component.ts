import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  ElementRef,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tags-chips',
  templateUrl: './tags-chips.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsChipsComponent implements OnInit {
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Output() selectTags = new EventEmitter<string[]>();
  @Input() set currentTags(tags: string[]) {
    // IMPORTANT: clone so we won't mutate the actual arrays
    this.allTags = [...tags];
  }
  @Input() set bookmarkTags(tags: string[]) {
    // IMPORTANT: clone so we won't mutate the actual arrays
    // this are basically array of strings so this kind of duplication will do
    this.selectedTags = [...tags];
    // cache the current bookmark tags so we know if we
    // unselect or remove a existing tag
    this.savedBookmarkTags = [...tags];
  }

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  selectedTags: string[] = [];
  allTags: string[] = [];
  savedBookmarkTags: string[] = [];

  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => this.updateAutoComplete(tag))
    );
  }

  ngOnInit() {}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.isUnique(value)) {
      if ((value || '').trim()) {
        this.selectedTags.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const { viewValue } = event.option;

    if (this.isUnique(viewValue)) {
      this.selectedTags.push(event.option.viewValue);
    }
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  updateTags() {
    this.selectTags.emit(this.selectedTags);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(
      tag => tag.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private isUnique(value: string) {
    return !this.selectedTags.includes(value);
  }

  private updateAutoComplete(tag: string | null) {
    const tags = tag ? this._filter(tag) : this.allTags.slice();

    return tags.filter(t => this.isUnique(t));
  }
}
