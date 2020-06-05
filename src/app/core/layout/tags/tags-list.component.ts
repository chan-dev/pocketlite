import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { TagsService } from '../../services/tags.service';
import { Tag } from '../../types/tag';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsListComponent implements OnInit {
  tags$: Observable<Tag[]>;
  isEditing = false;

  constructor(private tagsService: TagsService) {}

  ngOnInit(): void {
    this.tags$ = this.tagsService.fetchAll();
  }

  tagsTrackByFn(_: any, tag: Tag) {
    return tag.id;
  }
}
