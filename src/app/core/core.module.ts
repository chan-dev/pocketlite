import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '../shared/material.module';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';

@NgModule({
  declarations: [MainLayoutComponent, HeaderComponent, SidenavComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MaterialModule],
  exports: [MainLayoutComponent],
})
export class CoreModule {}
