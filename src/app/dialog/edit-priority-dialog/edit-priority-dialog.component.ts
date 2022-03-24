import {Component, Inject, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {OperationType} from "../OperationType";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-priority-dialog',
  templateUrl: './edit-priority-dialog.component.html',
  styleUrls: ['./edit-priority-dialog.component.css']
})

// создание/редактирование категории
export class EditPriorityDialogComponent implements OnInit {

  dialogTitle: string; // текст для диалогового окна
  priorityTitle: string; // текст для названия приоритета (при редактировании или добавлении)
  operationType: OperationType;

  constructor(
    private dialogRef: MatDialogRef<EditPriorityDialogComponent>, // // для возможности работы с текущим диалог. окном
    @Inject(MAT_DIALOG_DATA) private data: [string, string, OperationType], // данные, которые передали в диалоговое окно
    private dialog: MatDialog // для открытия нового диалогового окна (из текущего) - например для подтверждения удаления
  ) {
  }

  ngOnInit() {
    this.priorityTitle = this.data[0];
    this.dialogTitle = this.data[1];
    this.operationType = this.data[2];

  }

  // нажали ОК
  onConfirm(): void {
    this.dialogRef.close(this.priorityTitle);
  }

  // нажали отмену (ничего не сохраняем и закрываем окно)
  onCancel(): void {
    this.dialogRef.close(false);
  }

  // нажали Удалить
  delete(): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Confirm action',
        message: `Do you really want to remove the priority: "${this.priorityTitle}"? (all tasks are saved)`
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close('delete'); // нажали удалить
      }
    });
  }

  canDelete(): boolean {
    return this.operationType == OperationType.EDIT;
  }
}
