import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { AutoFocusDirective } from './directives/auto-focus.directive';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [AutoFocusDirective],
  imports: [
    CommonModule,
    MaterialModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    AutoFocusDirective,
    ConfirmDialogModule,
    InfiniteScrollModule,
    NgxSkeletonLoaderModule,
  ],
})
export class SharedModule {}
