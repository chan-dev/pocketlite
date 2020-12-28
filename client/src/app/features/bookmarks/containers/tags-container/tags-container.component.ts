import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Tag } from '@models/tag.model';
import * as tagsSelectors from '@app/features/bookmarks/state/selectors/tags.selectors';
import * as tagsActions from '@app/features/bookmarks/state/actions/tags.actions';

@Component({
  selector: 'app-tags-container',
  templateUrl: './tags-container.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsContainerComponent implements OnInit {
  // we need this to be a BehaviorSubject since combineLatest
  // won't emit any value unless all observales emit a value
  private readonly searchTerm = new BehaviorSubject<string>('');

  tags$: Observable<Tag[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    const currentTags$ = this.store.pipe(select(tagsSelectors.selectTags));

    this.tags$ = combineLatest([
      currentTags$,
      this.searchTerm.asObservable(),
    ]).pipe(
      map(([tags, term]) => tags.filter(tag => tag.name.indexOf(term) > -1))
    );
  }

  search(term: string) {
    this.searchTerm.next(term);
  }

  delete(tag: Tag) {
  }
}
