import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ToastrModule } from 'ngx-toastr';

import { AuthModule } from './auth/auth.module';
import { ConfirmDialogModule } from '@app/shared/confirm-dialog/confirm-dialog.module';
import { ErrorModule } from '@app/core/error/error.module';

import { environment } from 'src/environments/environment';

import { reducers } from './core.state';
import { RollbarService, rollbarFactory } from './rollbar';
import { AppErrorHandlerService } from './error/app-error-handler.service';
import { CustomSerializer } from './helpers/custom-serializer';
import { NotFoundComponent } from './components/not-found/not-found.component';

export function localStorageSyncReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return localStorageSync({ keys: ['auth'], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

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
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'PocketLite',
      logOnly: environment.production,
    }),
    AuthModule,
    ConfirmDialogModule,
    ErrorModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss: false,
      closeButton: true,
    }),
  ],
  exports: [
    AuthModule,
    ConfirmDialogModule,
    ErrorModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    // RouterModule,
    // ReactiveFormsModule,
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AppErrorHandlerService,
    },
    {
      provide: RollbarService,
      useFactory: rollbarFactory,
    },
  ],
})
export class CoreModule {}
