import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookmarkMustExistGuard } from './guards/bookmark-must-exist.guard';
import { BookmarksPageComponent } from './containers/bookmarks-page/bookmarks-page.component';
import { BookmarksCurrentListContainerComponent } from './containers/bookmarks-current-list-container-container/bookmarks-current-list-container.component';
import { BookmarkSearchResultsContainerComponent } from './containers/bookmark-search-results-container/bookmark-search-results-container.component';
import { BookmarkArchivesContainerComponent } from './containers/bookmark-archives-container/bookmark-archives-container.component';
import { BookmarkFavoritesContainerComponent } from './containers/bookmark-favorites-container/bookmark-favorites-container.component';
import { BookmarksByTagContainerComponent } from './containers/bookmarks-by-tag-container/bookmarks-by-tag-container.component';
import { BookmarkReaderViewPageComponent } from './containers/bookmark-reader-view-page/bookmark-reader-view-page.component';

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
  {
    path: 'reader/:id',
    component: BookmarkReaderViewPageComponent,
    canActivate: [BookmarkMustExistGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksRoutingModule {}
