import { Directive, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  /* selector: '[appAutoFocus][formControl], [appAutoFocus][ngModel]', */
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements OnInit {
  constructor(private elem: ElementRef) {}

  ngOnInit() {
    this.elem.nativeElement.focus();
  }
}
