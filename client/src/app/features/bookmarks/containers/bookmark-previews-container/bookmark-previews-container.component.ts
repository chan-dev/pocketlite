import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { Bookmark } from '@models/bookmark.model';

@Component({
  selector: 'app-bookmark-previews-container',
  templateUrl: './bookmark-previews-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkPreviewsContainerComponent implements OnInit {
  @Input() bookmarks: Bookmark[];

  constructor() {}

  ngOnInit() {}
}
