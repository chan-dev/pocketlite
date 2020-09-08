import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksCollectionContainerComponent } from './bookmarks-collection-container.component';

describe('BookmarkPreviewsContainerComponent', () => {
  let component: BookmarksCollectionContainerComponent;
  let fixture: ComponentFixture<BookmarksCollectionContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarksCollectionContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksCollectionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
