import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MarkdownModule } from 'ngx-markdown';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';

import { reducers } from './state/bookmarks.state';
import { BookmarkEffects } from './state/effects/bookmarks.effects';
import { TagEffects } from './state/effects/tags.effects';
import { FavoriteEffects } from './state/effects/favorites.effects';
import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { HeaderComponent } from './containers/header/header.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { TagComponent } from './components/tags/tag.component';
import { TagsListComponent } from './components/tags/tags-list.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AddLinkFormComponent } from './components/add-link-form/add-link-form.component';
import { BookmarksCurrentListContainerComponent } from './containers/bookmarks-current-list-container-container/bookmarks-current-list-container.component';
import { BookmarkPreviewComponent } from './components/bookmark-preview/bookmark-preview.component';
import { TextImgComponent } from './components/text-img/text-img.component';
// tslint:disable-next-line: max-line-length
import { BookmarksCollectionContainerComponent } from './containers/bookmarks-collection-container/bookmarks-collection-container.component';
import { BookmarkSearchResultsContainerComponent } from './containers/bookmark-search-results-container/bookmark-search-results-container.component';
import { BookmarkArchivesContainerComponent } from './containers/bookmark-archives-container/bookmark-archives-container.component';
import { BookmarkFavoritesContainerComponent } from './containers/bookmark-favorites-container/bookmark-favorites-container.component';
import { TagsContainerComponent } from './containers/tags-container/tags-container.component';
import { BookmarksByTagContainerComponent } from './containers/bookmarks-by-tag-container/bookmarks-by-tag-container.component';
import { TagSearchInputComponent } from './components/tag-search-input/tag-search-input.component';
import { TagsModalComponent } from './components/tags-modal/tags-modal.component';
import { TagsChipsComponent } from './components/tags-chips/tags-chips.component';
import { BookmarkReaderViewBodyComponent } from './components/bookmark-reader-view-body/bookmark-reader-view-body.component';
import { BookmarkReaderViewPageComponent } from './containers/bookmark-reader-view-page/bookmark-reader-view-page.component';
import { BookmarkReaderViewHeaderComponent } from './components/bookmark-reader-view-header/bookmark-reader-view-header.component';
import { BookmarksCollectionEmptyMessageDirective } from '@app/features/bookmarks/shared/directives/bookmarks-collection-empty-message.directive';
import { ThemePickerControlComponent } from './shared/components/theme-picker-control/theme-picker-control.component';

@NgModule({
  declarations: [
    BookmarksPageComponent,
    HeaderComponent,
    MainContentComponent,
    TagComponent,
    TagsListComponent,
    SearchBoxComponent,
    AddLinkFormComponent,
    BookmarksCurrentListContainerComponent,
    BookmarkPreviewComponent,
    TextImgComponent,
    BookmarksCollectionContainerComponent,
    BookmarkSearchResultsContainerComponent,
    BookmarkArchivesContainerComponent,
    BookmarkFavoritesContainerComponent,
    TagsContainerComponent,
    BookmarksByTagContainerComponent,
    TagSearchInputComponent,
    TagsModalComponent,
    TagsChipsComponent,
    BookmarkReaderViewBodyComponent,
    BookmarkReaderViewPageComponent,
    BookmarkReaderViewHeaderComponent,
    BookmarksCollectionEmptyMessageDirective,
    ThemePickerControlComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
    BookmarksRoutingModule,
    MarkdownModule.forChild(),
    StoreModule.forFeature('bookmarks', reducers),
    EffectsModule.forFeature([BookmarkEffects, FavoriteEffects, TagEffects]),
  ],
})
export class BookmarksModule {}
