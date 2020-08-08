import { Component, DebugElement, AfterViewInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AutoFocusDirective } from './auto-focus.directive';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-test',
  template: `
    <input
      appAutoFocus
      [formControl]="test"
      type="text"
      name="test"
      id="testInput"
      placeholder="test input"
    />
  `,
})
class TestComponent implements AfterViewInit {
  test: FormControl = new FormControl('');

  ngAfterViewInit() {}
}

describe('AutoFocusDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let debugElem: DebugElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AutoFocusDirective, TestComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElem = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should autofocus', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    const input = debugElem.query(By.css('#testInput')).nativeElement;
    const focusedElem = debugElem.query(By.css(':focus')).nativeElement;
    expect(focusedElem).toBe(input);
  });
});
