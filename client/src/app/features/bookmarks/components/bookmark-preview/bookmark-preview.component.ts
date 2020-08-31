import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { Bookmark } from '@models/bookmark.model';

@Component({
  selector: 'app-bookmark-preview',
  templateUrl: './bookmark-preview.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkPreviewComponent implements OnInit {
  @Input() bookmark: Bookmark;

  constructor() {}

  ngOnInit() {}
}
