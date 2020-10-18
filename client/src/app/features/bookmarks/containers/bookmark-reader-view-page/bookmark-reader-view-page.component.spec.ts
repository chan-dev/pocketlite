import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkReaderViewPageComponent } from './bookmark-reader-view-page.component';

describe('BookmarkReaderViewPageComponent', () => {
  let component: BookmarkReaderViewPageComponent;
  let fixture: ComponentFixture<BookmarkReaderViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkReaderViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkReaderViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
