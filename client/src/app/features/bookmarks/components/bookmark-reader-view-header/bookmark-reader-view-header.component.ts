import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';

@Component({
  selector: 'app-bookmark-reader-view-header',
  templateUrl: './bookmark-reader-view-header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkReaderViewHeaderComponent implements OnInit {
  @Output() updateBookmarkTags = new EventEmitter<Bookmark>();
  @Output() toggleFavorite = new EventEmitter<{
    bookmark: Bookmark;
    favorited: BookmarkFavorite;
  }>();
  @Input() bookmarkFavorite: BookmarkFavorite;
  @Input() bookmark: Bookmark;

  constructor() {}

  ngOnInit() {}

  toggleFavoriteBookmark() {
    this.toggleFavorite.emit({
      bookmark: this.bookmark,
      favorited: this.bookmarkFavorite,
    });
  }

  openTagsModal() {
    this.updateBookmarkTags.emit(this.bookmark);
  }

  isFavorited() {
    return !!this.bookmarkFavorite;
  }
}