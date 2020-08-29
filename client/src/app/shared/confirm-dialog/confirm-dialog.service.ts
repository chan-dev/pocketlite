import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from './confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private dialogService: MatDialog) {}

  open(options: ConfirmDialogData) {
    this.dialogRef = this.dialogService.open(ConfirmDialogComponent, {
      data: { ...options },
    });
  }

  confirmed(): Observable<boolean> {
    return this.dialogRef.afterClosed().pipe(take(1));
  }
}
