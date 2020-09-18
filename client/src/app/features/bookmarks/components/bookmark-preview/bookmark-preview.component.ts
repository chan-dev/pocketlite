import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
} from '@angular/core';

import { Bookmark } from '@models/bookmark.model';

@Component({
  selector: 'app-bookmark-preview',
  templateUrl: './bookmark-preview.component.html',
  styles: [
    `
      mat-menu {
        padding: 0;
      }

      .mat-menu-panel {
        border-radius: 0;
      }

      .mat-menu-content:not(:empty) {
        padding: 0 !important;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BookmarkPreviewComponent implements OnInit {
  @Output() delete = new EventEmitter<string>();
  @Output() archive = new EventEmitter<string>();
  @Input() bookmark: Bookmark;

  constructor() {}

  ngOnInit() {}

  deleteBookmark(id: string) {
    this.delete.emit(id);
  }

  archiveBookmark(id: string) {
    this.archive.emit(id);
  }
}
