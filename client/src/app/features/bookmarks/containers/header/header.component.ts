import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAuth from '@app/core/auth/state';
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

  constructor(private sidenavService: SidenavService, private store: Store) {}

  ngOnInit(): void {
    // TODO: create a HTTP request to retrieve jwt cookies
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
    this.searchboxVisible = false;
  }

  cancelAddLink() {
    this.addLinkFormVisible = false;
  }

  searchBookmarks(event) {}

  logout(event) {
    // TODO: dispatch Logout action
    this.store.dispatch(fromAuth.logout());
  }
}
