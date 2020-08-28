import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MaterialModule } from 'src/app/shared/material.module';
import { AuthRoutingModule } from './auth-routing.module';

import { authReducer, AuthEffects } from './state';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './components/callback/callback.component';

@NgModule({
  declarations: [LoginComponent, CallbackComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
})
export class AuthModule {}
