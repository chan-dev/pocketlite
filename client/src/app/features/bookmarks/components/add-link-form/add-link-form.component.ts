import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { reUrl } from '@constants/patterns';

@Component({
  selector: 'app-add-link-form',
  templateUrl: './add-link-form.component.html',
  styles: [],
})
export class AddLinkFormComponent implements OnInit {
  @Input() minimal: boolean;
  @Output() save = new EventEmitter<FormControl>();
  @Output() cancel = new EventEmitter<void>();

  private reUrl = reUrl;

  url: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reUrl),
  ]);

  constructor() {}

  ngOnInit(): void {}

  saveUrl() {
    this.save.emit(this.url);
  }
}
