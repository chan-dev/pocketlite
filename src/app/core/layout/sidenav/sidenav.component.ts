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
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  private sub: Subscription;
  private queryListener;

  mediaQuery: MediaQueryList;
  isChildNav = false;

  tags = ['#angular', '#vue', '#react'];

  constructor(
    private cd: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService
  ) {
    // NOTE: same with tailwind (md) media query class
    this.mediaQuery = this.media.matchMedia('(min-width: 768px)');
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

  toggleSidenav(event) {
    event.stopPropagation();
    this.sidenav.close();
  }

  openChildNav() {
    this.isChildNav = true;
  }

  closeChildNav() {
    this.isChildNav = false;
  }
}
