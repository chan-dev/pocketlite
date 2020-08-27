import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    // intercepts XSRF-TOKEN value and sends back a custom header
    // named X-XSRF-TOKEN on every unsafe HTTP request
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  exports: [],
})
export class CoreModule {}
