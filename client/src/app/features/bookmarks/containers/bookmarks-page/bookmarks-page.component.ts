import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styles: [
    // NOTE: flexbox creates a new context so we have better
    // control on the child elements inside
    //
    // We need html and body to span 100% so this component
    // height's computation is relative to that height
    `
      :host {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        min-height: 0;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksPageComponent {
  constructor() {}
}
