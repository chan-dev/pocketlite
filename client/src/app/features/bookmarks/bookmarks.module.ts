import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from './components/layout.module';
import { BookmarksRoutingModule } from './bookmarks-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, LayoutModule, BookmarksRoutingModule],
})
export class BookmarksModule {}
