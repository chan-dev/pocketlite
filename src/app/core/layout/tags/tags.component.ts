import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit {
  @Input() name: string;
  constructor() {}

  ngOnInit(): void {}
}
