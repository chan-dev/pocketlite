import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { Bookmark } from '@models/bookmark.model';
import { BookmarkFavorite } from '@models/bookmark-favorite.model';
import { ThemeRadioPickerOption } from '../../shared/components/theme-picker-control/theme-radio-picker-option.interface';
import { AVAILABLE_THEMES, Theme } from '@app/core/ui/state';
import * as fromUi from '@app/core/ui/state';

@Component({
  selector: 'app-bookmark-reader-view-header',
  templateUrl: './bookmark-reader-view-header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkReaderViewHeaderComponent implements OnInit {
  @Output() archive = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() restore = new EventEmitter<string>();
  @Output() updateBookmarkTags = new EventEmitter<Bookmark>();
  @Output() toggleFavorite = new EventEmitter<{
    bookmark: Bookmark;
    favorited: BookmarkFavorite;
  }>();
  @Input() bookmarkFavorite: BookmarkFavorite;
  @Input() bookmark: Bookmark;

  themePicker = new FormControl({
    value: null,
    disabled: false,
  });
  themes: ThemeRadioPickerOption[] = AVAILABLE_THEMES;

  selectedTheme$: Observable<Theme>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.selectedTheme$ = this.store.pipe(select(fromUi.selectTheme));
  }

  toggleFavoriteBookmark() {
    this.toggleFavorite.emit({
      bookmark: this.bookmark,
      favorited: this.bookmarkFavorite,
    });
  }

  openTagsModal() {
    this.updateBookmarkTags.emit(this.bookmark);
  }

  archiveBookmark() {
    this.archive.emit(this.bookmark.id);
  }

  deleteBookmark() {
    this.delete.emit(this.bookmark.id);
  }

  restoreBookmark() {
    this.restore.emit(this.bookmark.id);
  }

  isFavorited() {
    return !!this.bookmarkFavorite;
  }

  updateTheme(theme: ThemeRadioPickerOption) {
    this.store.dispatch(
      fromUi.updateThemeFromReaderViewPage({ theme: theme.value as Theme })
    );
  }
}
