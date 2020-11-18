import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';

import { Theme, ThemeClass } from '../state/ui.state';
import * as fromUi from '../state/ui.actions';

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
    private media: MediaMatcher
  ) {
    this.renderer = this.renderFactory.createRenderer(null, null);
    this.mediaQuery = this.media.matchMedia(this.mediaQueryCondition);
    this.checkColorSchemePreference = () => {
      if (this.mediaQuery.matches) {
        this.store.dispatch(fromUi.updateTheme({ theme: Theme.DARK }));
      } else {
        this.store.dispatch(fromUi.updateTheme({ theme: null }));
      }
    };

    this.initDarkModePreferenceListener();
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
    const darkTheme = ThemeClass.DARK;
    const sepiaTheme = ThemeClass.SEPIA;

    const documentElement = this.document.documentElement;

    if (theme === Theme.DARK) {
      this.renderer.removeClass(documentElement, sepiaTheme);
      this.renderer.addClass(documentElement, darkTheme);
    } else if (theme === Theme.SEPIA) {
      this.renderer.removeClass(documentElement, darkTheme);
      this.renderer.addClass(documentElement, sepiaTheme);
    } else {
      this.renderer.removeClass(documentElement, darkTheme);
      this.renderer.removeClass(documentElement, sepiaTheme);
    }
  }
}
