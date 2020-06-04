import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  constructor(private sidenavService: SidenavService) {}

  ngOnInit(): void {}

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
