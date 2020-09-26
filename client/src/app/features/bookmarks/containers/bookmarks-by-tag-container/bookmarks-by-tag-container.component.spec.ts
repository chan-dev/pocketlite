import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksByTagContainerComponent } from './bookmarks-by-tag-container.component';

describe('BookmarksByTagContainerComponent', () => {
  let component: BookmarksByTagContainerComponent;
  let fixture: ComponentFixture<BookmarksByTagContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarksByTagContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksByTagContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
