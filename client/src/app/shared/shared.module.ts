import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from './material.module';

import { AutoFocusDirective } from './directives/auto-focus.directive';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouteOrRedirectComponent } from './components/router-or-redirect/router-or-redirect.component';
import { RouteOrRedirectLinkContentDirective } from './components/router-or-redirect/route-or-redirect-content.directive';

@NgModule({
  declarations: [
    AutoFocusDirective,
    RouteOrRedirectComponent,
    RouteOrRedirectLinkContentDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule,
    NgxSpinnerModule,
  ],
  exports: [
    AutoFocusDirective,
    RouteOrRedirectComponent,
    RouteOrRedirectLinkContentDirective,
    ConfirmDialogModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
