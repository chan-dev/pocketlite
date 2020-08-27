import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';

import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TagsComponent } from './components/tags/tags.component';
import { TagsListComponent } from './components/tags/tags-list.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { AddLinkFormComponent } from './components/add-link-form/add-link-form.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SidenavComponent,
    TagsComponent,
    TagsListComponent,
    NotFoundComponent,
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
  ],
})
export class BookmarksModule {}
