import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { AutoFocusDirective } from './directives/auto-focus.directive';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [AutoFocusDirective],
  imports: [CommonModule, MaterialModule, InfiniteScrollModule],
  exports: [AutoFocusDirective, ConfirmDialogModule, InfiniteScrollModule],
})
export class SharedModule {}
