import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/Task";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {OperationType} from "../OperationType";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})

// Редактирование задачи в диалоговом окне
export class EditTaskDialogComponent implements OnInit {

  private dialogTitle: string; // Заголовок окна
  private task: Task; // Задача для редактирования
  private categories: Category[]; // Выбор из всех категорий
  private priorities: Priority[]; // Выбор из всех приоритетов
  tmpTitle: string; // Сохраняем новое название во временную переменную, чтобы она не отразилась на самой задаче и изменения можно было отменить
  tmpCategory: Category; // Сохраняем новую категорию
  tmpPriority: Priority; // Сохраняем новый приоритет
  tmpDate: Date; // Сохраняю новую дату
  operationType: OperationType;
  isMobile: boolean;

  constructor(
    // Работаем с текущим диалог. окном (запоминаем ссылку на него)
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    // Внедряем данные, которые получаем из родительского компонента
    @Inject(MAT_DIALOG_DATA)
    private data: [Task, string, OperationType], // Данные, которые передали в диалоговое окно
    private dialog: MatDialog, // Для открытия нового диалогового окна из текущего (Желаете подтвердить? -Да, -Нет)
    private deviceService: DeviceDetectorService // для определения типа устройства
  ) {
    this.isMobile = deviceService.isMobile();
  }

  get getDialogTitle(): string {
    return this.dialogTitle;
  }

  get getCategories(): Category[] {
    return this.categories;
  }

  get getPriorities(): Priority[] {
    return this.priorities;
  }

  get getTask(): Task {
    return this.task;
  }

  ngOnInit(): void {
    this.task = this.data[0]; // Получаем отредактированную задачу
    this.dialogTitle = this.data[1]; //Текст для заголовка
    this.operationType = this.data[2];
    this.tmpTitle = this.task.title; // Отображаем то название, которое было раньше
    this.tmpCategory = this.task.category; // Категория, которая была раньше
    this.tmpPriority = this.task.priority; // Приоритет, который был раньше
    this.tmpDate = this.task.date; // Дата, которая была раньше

    // this.dataHandler.getAllCategories().subscribe(items => this.categories = items);
    // this.dataHandler.getAllPriorities().subscribe(prior => this.priorities = prior);
  }

  // Подтверждаем изменения
  onConfirm(): void {
    this.task.title = this.tmpTitle; // Запоминаем новое название
    this.task.category = this.tmpCategory; // Запоминаем новую категорию
    this.task.priority = this.tmpPriority; // Запоминаем новый приоритет
    this.task.date = this.tmpDate; // Запоминаем новую дату
    this.dialogRef.close(this.task);  // Закрываем диалоговое окно, передаем измененную задачу
  }

  // Удаление задачи
  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Action confirmation',
        message: 'Do you really want to delete the task:\n' + this.task.title + '?'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.dialogRef.close('delete'); // Нажали удалить
    });
  }

  // Выполняем задачу
  complete() {
    this.dialogRef.close('complete');
  }

  // Не выполняем задачу
  notComplete() {
    this.dialogRef.close('notComplete');
  }

  canBeDeleted(): boolean {
    return this.operationType === OperationType.EDIT;
  }

  canActivateDeactivate(): boolean {
    return this.operationType === OperationType.EDIT;
  }
}

