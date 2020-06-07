import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Tag } from '../../types/tag';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit {
  @Input() tag: Tag;

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
}