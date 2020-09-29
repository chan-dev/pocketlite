import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, scan } from 'rxjs/operators';

import { UNTAGGED_ITEMS } from '@constants/tags';
import { Tag } from '@models/tag.model';
import * as tagsSelectors from '@app/features/bookmarks/state/selectors/tags.selectors';

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
  private untaggedItemsTag: Tag = {
    name: UNTAGGED_ITEMS,
    id: '',
    user_id: '',
  };

  tags$: Observable<Tag[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    // prepend the untagged-items tag
    const currentTags$ = this.store.pipe(
      select(tagsSelectors.selectTags),
      // NOTE: we append the untaggedItems to the current tags
      // we use scan() here instead of reduce() because reduce needs
      // the source observable to complete w/c is not the case for ngrx
      // selectors
      scan((acc, cur) => [...acc, ...cur], [this.untaggedItemsTag])
    );

    this.tags$ = combineLatest([
      currentTags$,
      this.searchTerm.asObservable(),
    ]).pipe(
      tap(values => console.log({ values })),
      map(([tags, term]) => tags.filter(tag => tag.name.indexOf(term) > -1))
    );
  }

  search(term: string) {
    this.searchTerm.next(term);
  }
}
