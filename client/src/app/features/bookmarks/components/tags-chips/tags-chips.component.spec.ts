import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsChipsComponent } from './tags-chips.component';

describe('TagsChipsComponent', () => {
  let component: TagsChipsComponent;
  let fixture: ComponentFixture<TagsChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
