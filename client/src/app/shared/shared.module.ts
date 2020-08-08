import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

import { AutoFocusDirective } from './directives/auto-focus.directive';

@NgModule({
  declarations: [AutoFocusDirective],
  imports: [CommonModule, MaterialModule],
  exports: [AutoFocusDirective],
})
export class SharedModule {}
