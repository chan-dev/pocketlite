import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';

import { Theme, ThemeClass } from '../state/ui.state';
import * as fromUi from '../state/ui.actions';
import { BrowserStorageService } from '../../services/browser-storage.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private mediaQueryCondition = '(prefers-color-scheme: dark)';

  mediaQuery: MediaQueryList;
  checkColorSchemePreference;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private renderFactory: RendererFactory2,
    private media: MediaMatcher,
    private browserStorageService: BrowserStorageService
  ) {
    this.renderer = this.renderFactory.createRenderer(null, null);
    this.mediaQuery = this.media.matchMedia(this.mediaQueryCondition);
    this.checkColorSchemePreference = () => {
      if (this.mediaQuery.matches) {
        this.store.dispatch(
          fromUi.updateThemeFromPreferColorSchemeMediaQuery({
            theme: Theme.DARK,
          })
        );
      } else {
        this.store.dispatch(
          fromUi.updateThemeFromPreferColorSchemeMediaQuery({
            theme: Theme.LIGHT,
          })
        );
      }
    };

    this.initDarkModePreferenceListener();
  }

  checkThemeOnLoad() {
    const savedTheme = this.browserStorageService.get('ui').theme;
    if (savedTheme) {
      this.checkSavedTheme(savedTheme);
    } else {
      this.checkColorSchemePreference();
    }
  }

  initDarkModePreferenceListener() {
    this.mediaQuery.addEventListener('change', this.checkColorSchemePreference);
  }

  removeDarkModePreferenceListener() {
    this.mediaQuery.removeEventListener(
      'change',
      this.checkColorSchemePreference
    );
  }

  updateTheme(theme) {
    const lightTheme = ThemeClass.LIGHT;
    const darkTheme = ThemeClass.DARK;
    const sepiaTheme = ThemeClass.SEPIA;

    const documentElement = this.document.documentElement;

    [lightTheme, darkTheme, sepiaTheme].forEach(className => {
      this.renderer.removeClass(documentElement, className);
    });

    if (theme === Theme.DARK) {
      this.renderer.addClass(documentElement, darkTheme);
    } else if (theme === Theme.SEPIA) {
      this.renderer.addClass(documentElement, sepiaTheme);
    } else {
      this.renderer.addClass(documentElement, lightTheme);
    }
  }

  private checkSavedTheme(savedTheme) {
    if (savedTheme) {
      this.store.dispatch(
        fromUi.updateThemeFromBrowserStorage({ theme: savedTheme })
      );
    }
  }
}
