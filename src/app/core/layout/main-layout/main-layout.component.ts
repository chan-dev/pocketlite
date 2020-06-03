import {
  Component,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: [
    `
      /* Sidenav */
      .mat-drawer:not(.mat-drawer-side) {
        box-shadow: none;
      }

      /* For buttons */
      :focus {
        outline: none;
      }
      ::-moz-focus-inner {
        border: 0;
      }

      .mat-sidenav-container {
        height: 100%;
        background: none;
      }

      .mat-drawer-side {
        border-right: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnDestroy {
  private queryListener;

  mediaQuery: MediaQueryList;

  constructor(cd: ChangeDetectorRef, media: MediaMatcher) {
    // NOTE: same with tailwind (md) media query class
    this.mediaQuery = media.matchMedia('(min-width: 768px)');
    this.queryListener = () => cd.detectChanges();
    this.mediaQuery.addEventListener('change', this.queryListener);
  }

  ngOnDestroy() {
    this.mediaQuery.addEventListener('change', this.queryListener);
  }

  toggleSidenav(event, sidenav) {
    event.stopPropagation();
    sidenav.close();
  }
}
