import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { Bookmark } from '@models/bookmark.model';
import { Tag } from '@models/tag.model';

@Component({
  selector: 'app-bookmark-reader-view-body',
  templateUrl: './bookmark-reader-view-body.component.html',
  styles: [
    `
      .article__body p {
        margin-bottom: 1.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BookmarkReaderViewBodyComponent implements OnInit {
  @Input() bookmark: Bookmark;
  @Input() tags: Tag[];

  constructor() {}

  ngOnInit() {}
}
