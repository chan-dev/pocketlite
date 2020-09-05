import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksContainerComponent } from './bookmarks-container.component';

describe('BookmarksListComponent', () => {
  let component: BookmarksContainerComponent;
  let fixture: ComponentFixture<BookmarksContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarksContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
