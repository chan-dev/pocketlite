import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { AutoFocusDirective } from './directives/auto-focus.directive';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';

@NgModule({
  declarations: [AutoFocusDirective],
  imports: [CommonModule, MaterialModule],
  exports: [AutoFocusDirective, ConfirmDialogModule],
})
export class SharedModule {}
