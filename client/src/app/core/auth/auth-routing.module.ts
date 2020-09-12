import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuestGuard } from './guards/guest.guard';
import { LoginComponent } from './components/login/login.component';
import { CallbackComponent } from './components/callback/callback.component';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [GuestGuard],
    children: [
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          // NOTE: this is required
          // this tells the routeReuseStrategy to cleanup all
          // route handles
          resetRoute: true,
        },
      },
      {
        path: 'callback',
        component: CallbackComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
