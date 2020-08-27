import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';

const routes: Routes = [{ path: '', component: BookmarksPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksRoutingModule {}
