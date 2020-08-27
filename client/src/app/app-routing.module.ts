import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/auth/guards/auth.guard';
import { GuestGuard } from './core/auth/guards/guest.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/bookmarks',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.module').then(m => m.AuthModule),
    canLoad: [GuestGuard],
  },
  {
    path: 'bookmarks',
    loadChildren: () =>
      import('./features/bookmarks/bookmarks.module').then(
        m => m.BookmarksModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
