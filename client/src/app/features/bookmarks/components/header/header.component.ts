import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { SidenavService } from '../../../../core/services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchboxVisible = false;
  addLinkFormVisible = false;

  constructor(private sidenavService: SidenavService) {}

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
}
