import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkPreviewComponent } from './bookmark-preview.component';

describe('BookmarkPreviewComponent', () => {
  let component: BookmarkPreviewComponent;
  let fixture: ComponentFixture<BookmarkPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
