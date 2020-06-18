import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    pathMatch: 'full',
    // canActivate: [],
    // children: []
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.module').then(m => m.AuthModule),
  },
  // TODO: create a not found component
  // {
  //   path: '**',
  //   component: NotFoundComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
