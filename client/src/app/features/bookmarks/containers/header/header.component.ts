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
import { Observable, Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

import { ToastrService } from 'ngx-toastr';

import { User } from '@models/user.model';
import { Theme } from '@app/core/ui/state';
import * as fromAuth from '@app/core/auth/state';
import * as fromBookmarks from '@app/features/bookmarks/state/actions/bookmarks.actions';
import * as fromRoot from '@app/core/core.state';
import * as fromUi from '@app/core/ui/state';
import { SidenavService } from '../../services/sidenav.service';
import { ThemeRadioPickerOption } from '../../shared/components/theme-picker-control/theme-radio-picker-option.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private queryListener;
  private mediaQueryCondition = '(min-width: 1280px)';
  private themePickerSub: Subscription;

  currentUser$: Observable<User>;
  selectedTheme$: Observable<Theme>;

  themePicker = new FormControl({
    value: null,
    disabled: false,
  });

  themes: ThemeRadioPickerOption[] = [
    {
      label: 'Light',
      value: Theme.LIGHT,
      color: '#fff',
    },
    {
      label: 'Dark',
      value: Theme.DARK,
      color: '#000',
    },
    {
      label: 'Sepia',
      value: Theme.SEPIA,
      color: '#f5eddd',
    },
  ];

  mediaQuery: MediaQueryList;
  searchboxVisible = false;
  addLinkFormVisible = false;

  constructor(
    private sidenavService: SidenavService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mediaQuery = this.media.matchMedia(this.mediaQueryCondition);
    this.queryListener = () => this.cd.detectChanges();
    this.mediaQuery.addEventListener('change', this.queryListener);
  }

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

    this.currentUser$ = this.store.pipe(select(fromAuth.selectCurrentUser));
    this.selectedTheme$ = this.store.pipe(select(fromUi.selectTheme));
  }

  ngOnDestroy() {
    this.mediaQuery.removeEventListener('change', this.queryListener);

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.themePickerSub) {
      this.themePickerSub.unsubscribe();
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

  logout() {
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

  updateTheme(theme: ThemeRadioPickerOption) {
    this.store.dispatch(fromUi.updateTheme({ theme: theme.value as Theme }));
  }

  private closeSearch() {
    this.searchboxVisible = false;
  }

  private closeAddLink() {
    this.addLinkFormVisible = false;
  }
}
