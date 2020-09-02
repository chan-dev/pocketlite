import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-text-img',
  templateUrl: './text-img.component.html',
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextImgComponent implements OnInit {
  @Input() text: string;

  constructor() {}

  ngOnInit() {}
}
