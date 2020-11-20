import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemePickerControlComponent } from './theme-picker-control.component';

describe('ThemePickerControlComponent', () => {
  let component: ThemePickerControlComponent;
  let fixture: ComponentFixture<ThemePickerControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemePickerControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePickerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
