import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit {
  @Input() name: string;

  isEditing = false;
  tagControl = new FormControl('', Validators.required);

  constructor() {}

  ngOnInit(): void {
    this.tagControl.setValue(this.name);
  }

  openEdit() {
    this.isEditing = true;
  }

  closeEdit() {
    this.isEditing = false;
  }
}
