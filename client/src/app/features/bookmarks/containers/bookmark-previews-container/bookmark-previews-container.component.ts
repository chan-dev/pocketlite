import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';
import * as fromBookmarks from '@app/features/bookmarks/state';

@Component({
  selector: 'app-bookmark-previews-container',
  templateUrl: './bookmark-previews-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkPreviewsContainerComponent implements OnInit {
  @Input() bookmarks: Bookmark[];

  placeholders = 9;

  constructor(private store: Store) {}

  ngOnInit() {}

  deleteBookmark(id: string) {
    this.store.dispatch(fromBookmarks.deleteBookmark({ id }));
  }

  generatePlaceholder(count: number) {
    // create an iterable of keys then convert to array
    return Array.from(Array(count).keys());
  }
}
