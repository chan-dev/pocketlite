import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

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
  isEditing = false;

  constructor(private sidenavService: SidenavService) {}

  ngOnInit(): void {}

  tagsTrackByFn(_: any, tag: Tag) {
    return tag.id;
  }

  closeSidenav() {
    this.sidenavService.toggle();
  }
}
