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

  constructor(private store: Store) {}

  ngOnInit() {}
}
