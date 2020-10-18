import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkReaderViewBodyComponent } from './bookmark-reader-view-body.component';

describe('BookmarkReaderViewComponent', () => {
  let component: BookmarkReaderViewBodyComponent;
  let fixture: ComponentFixture<BookmarkReaderViewBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BookmarkReaderViewBodyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkReaderViewBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
