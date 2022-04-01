import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {Category} from "../../model/Category";
import {DialogAction, DialogResult} from "../../object/DialogResult";
import {DeviceDetectorService} from "ngx-device-detector";

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
    private data: [Category, string], // Данные, которые передали в диалоговое окно
    private dialog: MatDialog // Для открытия нового диалогового окна из текущего (Желаете подтвердить? -Да, -Нет)
  ) {  }

  private dialogTitle: string; // Заголовок окна
  category: Category; // Категория
  canDelete = false; // Можно ли удалить объект (активна ли кнопка удаления)

  get getDialogTitle(): string {
    return this.dialogTitle;
  }

  ngOnInit(): void {
    this.category = this.data[0]; // Получаем отредактированную категорию
    this.dialogTitle = this.data[1]; // Текст для заголовка

    // Если было передано значение, значит это редактирование - поэтому удалить можно
    if (this.category && this.category.id && this.category.id > 0) {
      this.canDelete = true;
    }
  }

  // Подтверждаем изменения
  onConfirm(): void {
    // Запоминаем новую категорию
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.category));  // Закрываем диалоговое окно, передаем измененную категорию
  }

  // Удаление категории
  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Action confirmation',
        message: 'Do you really want to delete the category:\n' +  this.category.title + '?\n' +
                 '(all tasks will be saved)'

      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) { // если просто закрыли окно ничего не нажав
        return;
      }

      if (result.action === DialogAction.OK)
        this.dialogRef.close(new DialogResult(DialogAction.DELETE)); // Нажали удалить
    });
  }

  // нажали отмену (ничего не сохраняем и закрываем окно)
  onCancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
  }
}
