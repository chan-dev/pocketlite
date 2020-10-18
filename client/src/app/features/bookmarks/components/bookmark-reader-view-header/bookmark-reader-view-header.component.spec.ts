import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkReaderViewHeaderComponent } from './bookmark-reader-view-header.component';

describe('BookmarkReaderViewHeaderComponent', () => {
  let component: BookmarkReaderViewHeaderComponent;
  let fixture: ComponentFixture<BookmarkReaderViewHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkReaderViewHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkReaderViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
