import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { BookmarksCurrentListContainerComponent } from './containers/bookmarks-current-list-container-container/bookmarks-current-list-container.component';
import { BookmarkSearchResultsContainerComponent } from './containers/bookmark-search-results-container/bookmark-search-results-container.component';
import { BookmarkArchivesContainerComponent } from './containers/bookmark-archives-container/bookmark-archives-container.component';
import { BookmarkFavoritesContainerComponent } from './containers/bookmark-favorites-container/bookmark-favorites-container.component';
import { BookmarksByTagContainerComponent } from './containers/bookmarks-by-tag-container/bookmarks-by-tag-container.component';

const routes: Routes = [
  {
    path: '',
    component: BookmarksPageComponent,
    children: [
      {
        path: '',
        component: BookmarksCurrentListContainerComponent,
        data: {
          reuseRoute: true,
        },
      },
      {
        path: 'search',
        component: BookmarkSearchResultsContainerComponent,
      },
      {
        path: 'archives',
        component: BookmarkArchivesContainerComponent,
      },
      {
        path: 'favorites',
        component: BookmarkFavoritesContainerComponent,
      },
      {
        path: 'tags/:name',
        component: BookmarksByTagContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksRoutingModule {}
