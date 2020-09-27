import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tag-search-input',
  templateUrl: './tag-search-input.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagSearchInputComponent implements OnInit, OnDestroy {
  private readonly searchTermSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  @Output() search = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    this.searchTermSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(term => this.search.emit(term));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  searchTag(term: string) {
    // We MUST not change the actual tags[] state by using
    // creating ngrx actions because it's purely presentational and
    // we need all tags to be present all the time since
    // we'll provide autosuggest when adding bookmark tags

    // Our workaround is basically just filter thru the @Input tags array
    // and manually call change detection?

    // This is fuzzy-searching not actual matches
    // this.tags = this.tags.filter(tag => tag.name.indexOf(term) > -1);

    this.searchTermSubject.next(term);
  }
}
