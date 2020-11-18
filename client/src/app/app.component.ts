import { AfterViewInit, Component } from '@angular/core';

import { ThemeService } from './core/ui/services/theme.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements AfterViewInit {
  title = 'pocketlite';
  constructor(private uiService: ThemeService) {}

  ngAfterViewInit(): void {
    // matchMedia doesn't run on page load
    // basically, check on page load the current user preference
    this.uiService.checkColorSchemePreference();
  }
}
