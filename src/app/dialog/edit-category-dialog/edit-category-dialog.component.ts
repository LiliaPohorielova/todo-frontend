import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/Task";
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";

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
    private data: [string, string], // Данные, которые передали в диалоговое окно

    private dataHandler: DataHandlerService, // Ссылка на сервис для работы с данными
    private dialog: MatDialog // Для открытия нового диалогового окна из текущего (Желаете подтвердить? -Да, -Нет)
  ) { }

  private dialogTitle: string; // Заголовок окна
  categoryTitle: string; // Новое название для категории

  get getDialogTitle(): string {
    return this.dialogTitle;
  }

  get getCategoryTitle(): string {
    return this.categoryTitle;
  }

  ngOnInit(): void {
    this.categoryTitle = this.data[0]; // Получаем отредактированную категорию
    this.dialogTitle = this.data[1]; // Текст для заголовка
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

}
