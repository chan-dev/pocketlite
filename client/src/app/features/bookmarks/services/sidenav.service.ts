import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private toggleActionSubject = new Subject();
  readonly toggle$ = this.toggleActionSubject.asObservable();

  constructor() {}

  toggle() {
    this.toggleActionSubject.next();
  }
}
