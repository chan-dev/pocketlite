import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-link-form',
  templateUrl: './add-link-form.component.html',
  styles: [],
})
export class AddLinkFormComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
