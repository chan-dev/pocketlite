import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Tag } from '@models/tag.model';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements OnInit {
  @Input() tag: Tag;
  @Output() openTag = new EventEmitter<void>();

  isEditing = false;
  tagControl = new FormControl('', Validators.required);

  constructor() {}

  ngOnInit(): void {
    this.tagControl.setValue(this.tag.name);
  }

  openEdit(tagInput) {
    this.isEditing = true;
    // NOTE: this autofocuses the input when editing
    // but it is also required so blur event gets invoked
    // even if we focus on other non-form elements w/ the help
    // of cdkMonitorSubtreeFocus directive
    setTimeout(() => {
      tagInput.focus();
    }, 0);
  }

  closeEdit() {
    this.isEditing = false;
  }

  open() {
    this.openTag.emit();
  }
}
