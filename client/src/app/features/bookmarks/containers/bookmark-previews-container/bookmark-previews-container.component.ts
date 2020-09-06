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

  placeholders = 9;

  constructor() {}

  ngOnInit() {}

  generatePlaceholder(count: number) {
    // create an iterable of keys then convert to array
    return Array.from(Array(count).keys());
  }
}
