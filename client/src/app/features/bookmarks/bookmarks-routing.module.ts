import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { BookmarksListComponent } from './containers/bookmarks-list/bookmarks-list.component';

const routes: Routes = [
  {
    path: '',
    component: BookmarksPageComponent,
    children: [
      {
        path: '',
        component: BookmarksListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksRoutingModule {}
