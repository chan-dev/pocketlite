import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
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
        background: none;
      }

      .mat-drawer-side {
        border-right: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  private sub: Subscription;
  private queryListener;
  private mediaQueryCondition = '(min-width: 1280px)';

  mediaQuery: MediaQueryList;
  isChildNav = false;

  constructor(
    private cd: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService
  ) {
    // NOTE: same with tailwind (xl) media query class
    this.mediaQuery = this.media.matchMedia(this.mediaQueryCondition);
    this.queryListener = () => this.cd.detectChanges();
    this.mediaQuery.addEventListener('change', this.queryListener);
  }

  ngOnInit() {
    this.sub = this.sidenavService.toggle$.subscribe(() => {
      this.sidenav.toggle();
      // TODO: search why we need to do this
      this.cd.detectChanges();
    });
  }

  ngOnDestroy() {
    this.mediaQuery.removeEventListener('change', this.queryListener);

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  toggleSidenav() {
    // 1. Disable toggle functionality on larger screens, no need
    // to toggle since sidebar should be always visible
    // 2. On smaller screen sizes, we should close the sidenav on
    // every navigation, so we need this functionality enabled
    if (!this.mediaQuery.matches) {
      this.sidenav.close();
    }
  }

  openChildNav() {
    this.isChildNav = true;
  }

  closeChildNav() {
    this.isChildNav = false;
  }
}
