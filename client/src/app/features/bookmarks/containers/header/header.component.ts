import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import * as fromAuth from '@app/core/auth/state';
import * as fromBookmarks from '@app/features/bookmarks/state';
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

  loading$: Observable<boolean>;

  constructor(
    private sidenavService: SidenavService,
    private store: Store,
    private toastr: ToastrService
  ) {
    this.loading$ = this.store.select(fromBookmarks.selectBookmarksLoading);
  }

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
  }

  cancelAddLink() {
    this.closeAddLink();
  }

  searchBookmarks(event) {}

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
