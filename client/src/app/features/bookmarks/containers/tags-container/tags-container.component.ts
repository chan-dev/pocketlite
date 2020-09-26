import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromTags from '@app/features/bookmarks/state';
import { Tag } from '@models/tag.model';

@Component({
  selector: 'app-tags-container',
  templateUrl: './tags-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsContainerComponent implements OnInit {
  tags$: Observable<Tag[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.tags$ = this.store.pipe(select(fromTags.selectTags));
  }
}
