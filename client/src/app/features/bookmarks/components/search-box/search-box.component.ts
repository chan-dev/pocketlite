import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit {
  @Input() minimal: boolean;
  @Output() search = new EventEmitter<FormControl>();
  @Output() cancel = new EventEmitter<void>();

  query: FormControl = new FormControl('');

  constructor() {}

  ngOnInit(): void {}

  searchBookmarks(query) {
    this.search.emit(this.query);
  }
}
