import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [],
  exports: [MatSidenavModule, MatIconModule, MatTooltipModule, MatDialogModule],
})
export class MaterialModule {}
