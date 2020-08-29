import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  HostListener,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export type ConfirmDialogData = {
  cancelText: string;
  confirmText: string;
  message: string;
  title: string;
};

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent implements OnInit {
  @HostListener('keydown.esc')
  public onEsc() {
    this.cancel();
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  ngOnInit() {}

  cancel() {
    this.close(false);
  }

  confirm() {
    this.close(true);
  }

  private close(value: boolean) {
    this.dialogRef.close(value);
  }
}
