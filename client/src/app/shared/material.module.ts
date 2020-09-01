import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [],
  exports: [
    MatSidenavModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
  ],
})
export class MaterialModule {}
