import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styles: [],
})
export class SearchBoxComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
