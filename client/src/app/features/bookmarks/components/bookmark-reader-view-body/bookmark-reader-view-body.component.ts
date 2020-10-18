import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { Bookmark } from '@models/bookmark.model';
import { Tag } from '@models/tag.model';

@Component({
  selector: 'app-bookmark-reader-view-body',
  templateUrl: './bookmark-reader-view-body.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkReaderViewBodyComponent implements OnInit {
  @Input() bookmark: Bookmark;
  @Input() tags: Tag[];

  constructor() {}

  ngOnInit() {}
}
