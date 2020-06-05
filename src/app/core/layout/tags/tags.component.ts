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

  openEdit() {
    this.isEditing = true;
  }

  closeEdit() {
    this.isEditing = false;
  }
}
