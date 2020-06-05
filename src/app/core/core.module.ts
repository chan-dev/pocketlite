import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from '../shared/material.module';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { TagsComponent } from './layout/tags/tags.component';
import { TagsListComponent } from './layout/tags/tags-list.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SidenavComponent,
    TagsComponent,
    TagsListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [MainLayoutComponent],
})
export class CoreModule {}
