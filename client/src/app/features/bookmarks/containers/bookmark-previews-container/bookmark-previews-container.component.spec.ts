import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkPreviewsContainerComponent } from './bookmark-previews-container.component';

describe('BookmarkPreviewsContainerComponent', () => {
  let component: BookmarkPreviewsContainerComponent;
  let fixture: ComponentFixture<BookmarkPreviewsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkPreviewsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkPreviewsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
