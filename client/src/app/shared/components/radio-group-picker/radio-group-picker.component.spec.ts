import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import {
  RadioGroupPickerComponent,
  RadioGroupPickerOption,
} from './radio-group-picker.component';
import { RadioGroupPickerDirective } from './radio-group-picker.directive';

@Component({
  template: `<app-radio-group-picker
    class="custom-radio-group"
    [formControl]="radioPicker"
    [items]="items"
  >
    <div *appRadioGroupPicker="let item">
      <div class="test">
        {{ item.label }}
      </div>
    </div>
  </app-radio-group-picker>`,
})
class TestHostComponent {
  @ViewChild(RadioGroupPickerComponent)
  radioPickerComponent!: RadioGroupPickerComponent;

  radioPicker = new FormControl({
    value: null,
    disabled: false,
  });

  items: RadioGroupPickerOption[] = [
    {
      label: 'Item 1',
      value: '1',
    },
    {
      label: 'Item 2',
      value: '2',
    },
    {
      label: 'Item 3',
      value: '3',
    },
  ];
}

describe('RadioGroupPickerComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  const itemSelectedClass = 'ui-radio-group-item--selected';

  // let radioGroupPickerComponent: RadioGroupPickerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RadioGroupPickerComponent,
        TestHostComponent,
        RadioGroupPickerDirective,
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    // radioGroupPickerComponent = hostComponent.radioPickerComponent;

    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should accept items array binding', () => {
    expect(hostComponent.radioPickerComponent.items).toBeTruthy();
    expect(hostComponent.radioPickerComponent.items).toBeInstanceOf(Array);
  });

  it('should display number of items', () => {
    const radioGroupPickerDebug = hostFixture.debugElement.query(
      By.css('.custom-radio-group')
    );

    const numberOfItems = hostComponent.radioPickerComponent.items.length;

    expect(
      radioGroupPickerDebug.queryAll(By.css('[role="radio"]')).length
    ).toEqual(numberOfItems);
  });

  it('should accept custom css for easier styling', () => {
    const radioGroup = hostFixture.debugElement.query(
      By.css('.ui-radio-group-picker')
    ).nativeElement;

    const customCss = 'example-class';

    hostComponent.radioPickerComponent.styleClass = customCss;
    hostFixture.detectChanges();

    expect(radioGroup.classList.contains(customCss)).toBeTrue();
  });

  describe('a11y checks', () => {
    it('should add aria-label', () => {
      const radioGroup = hostFixture.debugElement.query(
        By.css('[role="radiogroup"]')
      ).nativeElement;

      const ariaLabel = 'Custom Radio Group';

      hostComponent.radioPickerComponent.ariaLabel = ariaLabel;
      hostFixture.detectChanges();

      expect(radioGroup.getAttribute('aria-label')).toBe(ariaLabel);
    });

    it('should contain all aria-checked attribute', () => {
      const radioGroupPickerDebug = hostFixture.debugElement.query(
        By.css('.custom-radio-group')
      );
      const numberOfItems = hostComponent.radioPickerComponent.items.length;

      expect(
        radioGroupPickerDebug.queryAll(By.css('[role="radio"][aria-checked]'))
          .length
      ).toEqual(numberOfItems);
    });

    it('should contain all tab-index attribute', () => {
      const radioGroupPickerDebug = hostFixture.debugElement.query(
        By.css('.custom-radio-group')
      );
      const numberOfItems = hostComponent.radioPickerComponent.items.length;

      expect(
        radioGroupPickerDebug.queryAll(By.css('[role="radio"][tabindex]'))
          .length
      ).toEqual(numberOfItems);
    });

    it('should match aria-label with each item label', () => {
      const radioGroupPickerDebug = hostFixture.debugElement.query(
        By.css('.custom-radio-group')
      );
      const items = hostComponent.radioPickerComponent.items;

      // NOTE: for some reason, using loop needs a workaround
      // so I just chose to explicitly check each element
      expect(
        radioGroupPickerDebug
          .queryAll(By.css('[role="radio"][aria-label]'))[0]
          .nativeElement.getAttribute('aria-label')
      ).toEqual(items[0].label);
      expect(
        radioGroupPickerDebug
          .queryAll(By.css('[role="radio"][aria-label]'))[1]
          .nativeElement.getAttribute('aria-label')
      ).toEqual(items[1].label);
      expect(
        radioGroupPickerDebug
          .queryAll(By.css('[role="radio"][aria-label]'))[2]
          .nativeElement.getAttribute('aria-label')
      ).toEqual(items[2].label);
    });

    it('should allow to assign a label', () => {
      const testLabel = 'Test Label';

      hostComponent.radioPickerComponent.label = testLabel;
      hostFixture.detectChanges();

      const label = hostFixture.debugElement.query(
        By.css('.ui-radio-group-label')
      ).nativeElement;
      const radioGroup = hostFixture.debugElement.query(
        By.css('[role="radiogroup"]')
      ).nativeElement;

      expect(label.innerText).withContext('should have label').toBe(testLabel);

      expect(radioGroup.getAttribute('aria-label'))
        .withContext('should have aria-label if label is provided')
        .toBeTruthy();
    });
  });

  it('should contain dynamic template', () => {
    const dynamicContentDebug = hostFixture.debugElement
      .query(By.css('.custom-radio-group'))
      .queryAll(By.css('.test'));

    expect(dynamicContentDebug.length).toEqual(3);
  });

  it('should set the value based on the parent component radioPicker value', () => {
    const selectedItem = hostComponent.items[1];
    hostComponent.radioPicker.setValue(selectedItem);

    hostFixture.detectChanges();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    expect(
      itemsDebug[0].nativeElement.classList.contains(itemSelectedClass)
    ).toBeFalse();
    expect(
      itemsDebug[1].nativeElement.classList.contains(itemSelectedClass)
    ).toBeTrue();
    expect(
      itemsDebug[2].nativeElement.classList.contains(itemSelectedClass)
    ).toBeFalse();
  });

  it('should only select 1 item at a time', () => {
    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    const option3 = itemsDebug[2].nativeElement;
    option3.dispatchEvent(new Event('click'));

    hostFixture.detectChanges();

    expect(
      itemsDebug[0].nativeElement.classList.contains(itemSelectedClass)
    ).toBe(false);
    expect(
      itemsDebug[1].nativeElement.classList.contains(itemSelectedClass)
    ).toBe(false);
    expect(
      itemsDebug[2].nativeElement.classList.contains(itemSelectedClass)
    ).toBe(true);

    const option1 = itemsDebug[0].nativeElement;
    option1.dispatchEvent(new Event('click'));

    hostFixture.detectChanges();

    expect(
      itemsDebug[0].nativeElement.classList.contains(itemSelectedClass)
    ).toBeTrue();
    expect(
      itemsDebug[1].nativeElement.classList.contains(itemSelectedClass)
    ).toBeFalse();
    expect(
      itemsDebug[2].nativeElement.classList.contains(itemSelectedClass)
    ).toBeFalse();
  });

  it('should set the parent component formControl based on selected item', () => {
    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    const option3 = itemsDebug[2].nativeElement;
    option3.dispatchEvent(new Event('click'));

    hostFixture.detectChanges();

    const item3 = hostComponent.items[2];
    expect(hostComponent.radioPicker.value).toBe(item3);
  });

  it('should set the correct aria-checked value', () => {
    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    const item3 = hostComponent.items[2];
    hostComponent.radioPicker.setValue(item3);
    hostFixture.detectChanges();

    expect(itemsDebug[0].nativeElement.getAttribute('aria-checked')).toBe(
      'false'
    );
    expect(itemsDebug[1].nativeElement.getAttribute('aria-checked')).toBe(
      'false'
    );
    expect(itemsDebug[2].nativeElement.getAttribute('aria-checked')).toBe(
      'true'
    );
  });

  it('should call touch event', () => {
    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    const option3 = itemsDebug[2].nativeElement;
    option3.dispatchEvent(new Event('click'));

    hostFixture.detectChanges();

    const nativeElement = hostFixture.debugElement.query(
      By.css('app-radio-group-picker')
    ).nativeElement;

    expect(nativeElement.classList.contains('ng-touched')).toBeTrue();
  });

  it('should not select any item when disabled', () => {
    hostComponent.radioPicker.disable();
    hostFixture.detectChanges();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    const option3 = itemsDebug[2].nativeElement;
    option3.dispatchEvent(new Event('click'));

    // hostFixture.detectChanges();

    const nativeElement = hostFixture.debugElement.query(
      By.css('app-radio-group-picker [role="radiogroup"]')
    ).nativeElement;

    expect(nativeElement.classList.contains('disabled')).toBeTrue();
    expect(option3.classList.contains(itemSelectedClass)).toBeFalse();
    expect(option3.classList.contains(itemSelectedClass)).toBeFalse();
    expect(option3.getAttribute('aria-checked')).toBe('false');
  });

  it('should select item when space button is pressed', () => {
    const spy = spyOn(
      hostComponent.radioPickerComponent,
      'setSelectedItem'
    ).and.callThrough();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    // TODO: add withContext on all previous tests
    const option1 = itemsDebug[0].nativeElement;
    expect(option1.classList.contains(itemSelectedClass))
      .withContext(
        'should have no ui-radio-group-item--selected class by default'
      )
      .toBeFalse();

    // emulate space button keyup press
    const spaceKeyupEvent = new KeyboardEvent('keyup', {
      code: 'Space',
      bubbles: true,
    });
    itemsDebug[0].triggerEventHandler('keyup.Space', {});
    hostFixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(option1.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class once space bar is pressed'
      )
      .toBeTrue();
  });

  it('should be navigated thru arrow up key', () => {
    const items = hostComponent.items;
    const item2 = items[1];
    hostComponent.radioPicker.setValue(item2);
    hostFixture.detectChanges();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    expect(itemsDebug[1].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on second option'
      )
      .toBeTrue();

    itemsDebug[1].triggerEventHandler('keyup', {
      code: 'ArrowUp',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to first item'
      )
      .toBe(items[0]);
    expect(itemsDebug[0].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on first option'
      )
      .toBeTrue();

    itemsDebug[0].triggerEventHandler('keyup', {
      code: 'ArrowUp',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to last item'
      )
      .toBe(items[2]);
    expect(itemsDebug[2].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on last option'
      )
      .toBeTrue();
  });

  it('should be navigated thru arrow left key', () => {
    const items = hostComponent.items;
    const item2 = items[1];
    hostComponent.radioPicker.setValue(item2);
    hostFixture.detectChanges();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    expect(itemsDebug[1].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on second option'
      )
      .toBeTrue();

    itemsDebug[1].triggerEventHandler('keyup', {
      code: 'ArrowLeft',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to first item'
      )
      .toBe(items[0]);
    expect(itemsDebug[0].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on first option'
      )
      .toBeTrue();

    itemsDebug[0].triggerEventHandler('keyup', {
      code: 'ArrowLeft',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to last item'
      )
      .toBe(items[2]);
    expect(itemsDebug[2].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on last option'
      )
      .toBeTrue();
  });

  it('should be navigated thru arrow down key', () => {
    const items = hostComponent.items;
    const item2 = items[1];
    hostComponent.radioPicker.setValue(item2);
    hostFixture.detectChanges();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    expect(itemsDebug[1].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on second option'
      )
      .toBeTrue();

    itemsDebug[1].triggerEventHandler('keyup', {
      code: 'ArrowDown',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to last item'
      )
      .toBe(items[2]);
    expect(itemsDebug[2].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on last option'
      )
      .toBeTrue();

    itemsDebug[2].triggerEventHandler('keyup', {
      code: 'ArrowDown',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to first item'
      )
      .toBe(items[0]);
    expect(itemsDebug[0].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on first option'
      )
      .toBeTrue();
  });
  it('should be navigated thru arrow right key', () => {
    const items = hostComponent.items;
    const item2 = items[1];
    hostComponent.radioPicker.setValue(item2);
    hostFixture.detectChanges();

    const itemsDebug = hostFixture.debugElement.queryAll(
      By.css('app-radio-group-picker div[role="radio"]')
    );

    expect(itemsDebug[1].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on second option'
      )
      .toBeTrue();

    itemsDebug[1].triggerEventHandler('keyup', {
      code: 'ArrowRight',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to last item'
      )
      .toBe(items[2]);
    expect(itemsDebug[2].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on last option'
      )
      .toBeTrue();

    itemsDebug[2].triggerEventHandler('keyup', {
      code: 'ArrowRight',
    });
    hostFixture.detectChanges();

    expect(hostComponent.radioPicker.value)
      .withContext(
        'should set parent component radioPicker form control to first item'
      )
      .toBe(items[0]);
    expect(itemsDebug[0].nativeElement.classList.contains(itemSelectedClass))
      .withContext(
        'should have ui-radio-group-item--selected class on first option'
      )
      .toBeTrue();
  });
});
