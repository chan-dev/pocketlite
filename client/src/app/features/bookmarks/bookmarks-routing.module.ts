import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { BookmarksContainerComponent } from './containers/bookmarks-container/bookmarks-container.component';
import { BookmarkSearchResultsContainerComponent } from './containers/bookmark-search-results-container/bookmark-search-results-container.component';

const routes: Routes = [
  {
    path: '',
    component: BookmarksPageComponent,
    children: [
      {
        path: '',
        component: BookmarksContainerComponent,
      },
      {
        path: 'search',
        component: BookmarkSearchResultsContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksRoutingModule {}
