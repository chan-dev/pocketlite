import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { UNTAGGED_ITEMS } from '@constants/tags';
import { Tag } from '@models/tag.model';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit {
  @Input() tags: Tag[];
  @Output() delete = new EventEmitter<Tag>();
  isEditing = false;

  untaggedItemsTag: Tag = {
    name: UNTAGGED_ITEMS,
    id: '',
    user_id: '',
  };

  constructor(private sidenavService: SidenavService) {}

  ngOnInit(): void {}

  tagsTrackByFn(_: any, tag: Tag) {
    return tag.id;
  }

  closeSidenav() {
    this.sidenavService.toggle();
  }

  deleteTag(tag: Tag) {
    this.delete.emit(tag);
  }
}
