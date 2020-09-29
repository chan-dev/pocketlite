import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import * as fromAuth from '@app/core/auth/state';
import * as fromBookmarks from '@app/features/bookmarks/state/actions/bookmarks.actions';
import * as fromRoot from '@app/core/core.state';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  searchboxVisible = false;
  addLinkFormVisible = false;

  constructor(
    private sidenavService: SidenavService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(select(fromRoot.selectRouteUrl))
      .subscribe(url => {
        // close searchbox everytime we navigate away
        // from search component
        if (url.indexOf('/search') < 0) {
          // Since we're changing this.searchboxVisible thru this.closeSearch()
          // w/o any event handler occuring in this component or child components
          // then we have to manually call change detection
          this.closeSearch();

          // Since using OnPush strategy
          // change detection in OnPush only runs if one of these occurs
          // * Input() binding changes (no input binding for current component)
          // * This component or one of it's children triggers an event handler
          // * Observable in our templates using async emits a new value
          // * Change detection is run manually
          this.cd.detectChanges();
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  showSearchBox() {
    this.searchboxVisible = true;
  }

  showAddLinkForm() {
    this.addLinkFormVisible = true;
  }

  cancelSearch() {
    this.closeSearch();
    this.router.navigate(['/']);
  }

  cancelAddLink() {
    this.closeAddLink();
  }

  searchBookmarks(query: FormControl) {
    if (query.value.length) {
      this.store.dispatch(fromBookmarks.startSearch({ query: query.value }));
    }
  }

  logout(event) {
    // TODO: dispatch Logout action
    this.store.dispatch(fromAuth.logout());
  }

  saveUrl(url: FormControl) {
    if (url.value.length) {
      if (url.invalid) {
        this.toastr.error('Please enter a valid url');
      } else {
        this.store.dispatch(fromBookmarks.saveBookmark({ url: url.value }));
      }
    }
    this.closeAddLink();
  }

  private closeSearch() {
    this.searchboxVisible = false;
  }

  private closeAddLink() {
    this.addLinkFormVisible = false;
  }
}
