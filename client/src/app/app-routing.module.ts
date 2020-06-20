import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/auth/guards/auth.guard';
import { GuestGuard } from './core/auth/guards/guest.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { NotFoundComponent } from './core/layout/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    // children: []
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.module').then(m => m.AuthModule),
    canLoad: [GuestGuard],
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
