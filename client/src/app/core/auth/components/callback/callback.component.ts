import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from '@app/core/auth/state';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    // once oauth2 process is completed, this is where the server will redirect us w/c is set
    // in server/config/keys.ts redirectUrl
    // The sole purpose of this component is to dispatch an action
    // that indicates the user is now authenticated by the server
    this.store.dispatch(fromAuth.login());
  }
}
