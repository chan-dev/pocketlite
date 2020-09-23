import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkFavoritesContainerComponent } from './bookmark-favorites-container.component';

describe('BookmarkFavoritesContainerComponent', () => {
  let component: BookmarkFavoritesContainerComponent;
  let fixture: ComponentFixture<BookmarkFavoritesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkFavoritesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkFavoritesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
