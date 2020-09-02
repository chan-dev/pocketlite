import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextImgComponent } from './text-img.component';

describe('TextImgPlaceholderComponent', () => {
  let component: TextImgComponent;
  let fixture: ComponentFixture<TextImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextImgComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
