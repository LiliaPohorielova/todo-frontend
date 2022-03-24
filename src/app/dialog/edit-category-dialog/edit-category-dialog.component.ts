import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {OperationType} from "../OperationType";

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {

  constructor(
    // Работаем с текущим диалог. окном (запоминаем ссылку на него)
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,

    // Внедряем данные, которые получаем из родительского компонента
    @Inject(MAT_DIALOG_DATA)
    private data: [string, string, OperationType], // Данные, которые передали в диалоговое окно
    private dialog: MatDialog // Для открытия нового диалогового окна из текущего (Желаете подтвердить? -Да, -Нет)
  ) { }

  private dialogTitle: string; // Заголовок окна
  categoryTitle: string; // Новое название для категории
  operationType: OperationType;

  get getDialogTitle(): string {
    return this.dialogTitle;
  }

  get getCategoryTitle(): string {
    return this.categoryTitle;
  }

  ngOnInit(): void {
    this.categoryTitle = this.data[0]; // Получаем отредактированную категорию
    this.dialogTitle = this.data[1]; // Текст для заголовка
    this.operationType = this.data[2];
  }

  // Подтверждаем изменения
  onConfirm(): void {
    //this.categoryTitle = this.categoryTitle; // Запоминаем новое название
    this.dialogRef.close(this.categoryTitle);  // Закрываем диалоговое окно, передаем измененную категорию
  }

  // Удаление категории
  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Action confirmation',
        message: 'Do you really want to delete the category:\n' +  this.categoryTitle + '?\n' +
                 '(all tasks will be saved)'

      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.dialogRef.close('delete'); // Нажали удалить
    });
  }

  canBeDeleted(): boolean {
    return this.operationType === OperationType.EDIT;
  }

  // нажали отмену (ничего не сохраняем и закрываем окно)
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
