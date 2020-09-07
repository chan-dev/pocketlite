import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkSearchResultsContainerComponent } from './bookmark-search-results-container.component';

describe('BookmarkSearchResultsContainerComponent', () => {
  let component: BookmarkSearchResultsContainerComponent;
  let fixture: ComponentFixture<BookmarkSearchResultsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkSearchResultsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkSearchResultsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
