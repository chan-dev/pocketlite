import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* import { BookmarksComponent } from './bookmarks.component'; */
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

const routes: Routes = [{ path: '', component: MainLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookmarksRoutingModule {}
