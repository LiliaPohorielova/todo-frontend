import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogAction, DialogResult} from "../../object/DialogResult";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})

// Диалоговое окно подтверждения действия
export class ConfirmDialogComponent implements OnInit {

  private dialogTitle: string;
  private message: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>, // Для работы с текущем диалоговым окном
    @Inject(MAT_DIALOG_DATA)
    private data: {dialogTitle: string, message: string}
  ) {
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
  }

  ngOnInit(): void { }

  // Подтвердили
  onConfirm(): void {
    this.dialogRef.close(new DialogResult(DialogAction.OK));
  }

  // Подтвердили
  onCancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }

  get getDialogTitle(): string {
    return this.dialogTitle;
  }

  get getMessage(): string {
    return this.message;
  }

}
