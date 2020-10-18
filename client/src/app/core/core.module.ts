import { NgModule, ErrorHandler, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { throwError } from 'rxjs';
import {
  StoreRouterConnectingModule,
  NavigationActionTiming,
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ToastrModule } from 'ngx-toastr';
import { MarkdownModule } from 'ngx-markdown';

import { AuthModule } from './auth/auth.module';
import { ConfirmDialogModule } from '@app/shared/confirm-dialog/confirm-dialog.module';
import { ErrorModule } from '@app/core/error/error.module';

import { environment } from 'src/environments/environment';

import { reducers } from './core.state';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { RollbarService, rollbarFactory } from './rollbar';
import { AppErrorHandlerService } from './error/app-error-handler.service';
import { CustomSerializer } from './helpers/custom-serializer';
import { CustomRouteReuseStrategy } from './helpers/custom-route-reuse';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthEffects } from './auth/state';

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
    MarkdownModule.forRoot(),
    // intercepts XSRF-TOKEN value and sends back a custom header
    // named X-XSRF-TOKEN on every unsafe HTTP request
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    AuthModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      name: 'PocketLite',
      logOnly: environment.production,
    }),
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    // {
    //   provide: RouteReuseStrategy,
    //   useClass: CustomRouteReuseStrategy,
    // },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throwError('CoreModule can only be imported once inside AppModule');
    }
  }
}
