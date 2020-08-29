import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AuthModule } from './auth/auth.module';

import { environment } from 'src/environments/environment';

import { reducers } from './core.state';
import { CustomSerializer } from './helpers/custom-serializer';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    // intercepts XSRF-TOKEN value and sends back a custom header
    // named X-XSRF-TOKEN on every unsafe HTTP request
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    // we don't have state available upfront
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'PocketLite',
      logOnly: environment.production,
    }),
    AuthModule,
  ],
  exports: [
    AuthModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    // RouterModule,
    // ReactiveFormsModule,
  ],
})
export class CoreModule {}
