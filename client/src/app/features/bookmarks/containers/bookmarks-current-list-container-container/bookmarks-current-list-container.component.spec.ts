import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksCurrentListContainerComponent } from './bookmarks-container.component';

describe('BookmarksListComponent', () => {
  let component: BookmarksCurrentListContainerComponent;
  let fixture: ComponentFixture<BookmarksCurrentListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarksCurrentListContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarksCurrentListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
