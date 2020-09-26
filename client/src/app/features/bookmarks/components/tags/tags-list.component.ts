import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';

import { Tag } from '@models/tag.model';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit {
  @Input() tags: Tag[];
  isEditing = false;

  constructor() {}

  ngOnInit(): void {}

  tagsTrackByFn(_: any, tag: Tag) {
    return tag.id;
  }
}
