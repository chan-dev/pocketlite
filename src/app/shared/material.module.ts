import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [],
  exports: [MatSidenavModule, MatIconModule, MatTooltipModule, A11yModule],
})
export class MaterialModule {}
