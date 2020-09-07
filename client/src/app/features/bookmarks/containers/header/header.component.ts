import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ToastrService } from 'ngx-toastr';

import * as fromAuth from '@app/core/auth/state';
import * as fromBookmarks from '@app/features/bookmarks/state/bookmarks.actions';
import * as fromSearch from '@app/features/bookmarks/state/search.actions';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchboxVisible = false;
  addLinkFormVisible = false;

  constructor(
    private sidenavService: SidenavService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

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
      this.store.dispatch(fromSearch.searchBookmark({ query: query.value }));
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
