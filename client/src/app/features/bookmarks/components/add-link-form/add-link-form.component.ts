import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-link-form',
  templateUrl: './add-link-form.component.html',
  styles: [],
})
export class AddLinkFormComponent implements OnInit {
  @Output() save = new EventEmitter<FormControl>();
  @Output() cancel = new EventEmitter<void>();

  // TODO: update the regex because it's inaccurate
  private reUrl = /(^https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

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
