import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { isArrayEqual } from '@helpers/index';

@Component({
  selector: 'app-tags-modal',
  templateUrl: './tags-modal.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { allTags: string[]; bookmarkTags: string[] },
    private dialogRef: MatDialogRef<TagsModalComponent>
  ) {}

  ngOnInit() {}

  cancel() {
    this.close(null);
  }

  updateTags(selectedTags: string[]) {
    const tags = this.checkTags(selectedTags);
    this.close(tags);
  }

  private close(tags: string[] | null) {
    this.dialogRef.close(tags);
  }

  private checkTags(selectedTags: string[]) {
    // null in this case means the selected tags is unchanged
    // we check it inside BookmarkEffects.openTagsModal$
    const tags = isArrayEqual(selectedTags, this.data.bookmarkTags)
      ? null
      : selectedTags;

    return tags;
  }
}
