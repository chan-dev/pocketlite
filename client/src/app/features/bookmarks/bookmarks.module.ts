import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';

import { reducers, BookmarkEffects, SearchEffects } from './state';
import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { HeaderComponent } from './containers/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagsListComponent } from './components/tags/tags-list.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AddLinkFormComponent } from './components/add-link-form/add-link-form.component';
import { BookmarksContainerComponent } from './containers/bookmarks-container/bookmarks-container.component';
import { BookmarkPreviewComponent } from './components/bookmark-preview/bookmark-preview.component';
import { TextImgComponent } from './components/text-img/text-img.component';
import { BookmarkPreviewsContainerComponent } from './containers/bookmark-previews-container/bookmark-previews-container.component';
import { BookmarkSearchResultsContainerComponent } from './containers/bookmark-search-results-container/bookmark-search-results-container.component';

@NgModule({
  declarations: [
    BookmarksPageComponent,
    HeaderComponent,
    SidenavComponent,
    TagsComponent,
    TagsListComponent,
    SearchBoxComponent,
    AddLinkFormComponent,
    BookmarksContainerComponent,
    BookmarkPreviewComponent,
    TextImgComponent,
    BookmarkPreviewsContainerComponent,
    BookmarkSearchResultsContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MaterialModule,
    BookmarksRoutingModule,
    StoreModule.forFeature('bookmarks', reducers),
    EffectsModule.forFeature([BookmarkEffects, SearchEffects]),
  ],
})
export class BookmarksModule {}
