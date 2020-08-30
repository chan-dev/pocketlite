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

import { reducers, BookmarkEffects } from './state';
import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagsListComponent } from './components/tags/tags-list.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AddLinkFormComponent } from './components/add-link-form/add-link-form.component';

@NgModule({
  declarations: [
    BookmarksPageComponent,
    HeaderComponent,
    SidenavComponent,
    TagsComponent,
    TagsListComponent,
    SearchBoxComponent,
    AddLinkFormComponent,
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
    EffectsModule.forFeature([BookmarkEffects]),
  ],
})
export class BookmarksModule {}
