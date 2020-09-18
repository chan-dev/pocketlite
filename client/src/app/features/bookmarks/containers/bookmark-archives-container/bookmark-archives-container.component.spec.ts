import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkArchivesContainerComponent } from './bookmark-archives-container.component';

describe('BookmarkArchivesContainerComponent', () => {
  let component: BookmarkArchivesContainerComponent;
  let fixture: ComponentFixture<BookmarkArchivesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkArchivesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkArchivesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
