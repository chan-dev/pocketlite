import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSearchInputComponent } from './tag-search-input.component';

describe('TagSearchInputComponent', () => {
  let component: TagSearchInputComponent;
  let fixture: ComponentFixture<TagSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
