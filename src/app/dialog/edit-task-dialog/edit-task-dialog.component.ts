import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/Task";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {DeviceDetectorService} from "ngx-device-detector";
import {DialogAction, DialogResult} from "../../object/DialogResult";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})

// Редактирование задачи в диалоговом окне
export class EditTaskDialogComponent implements OnInit {

  private dialogTitle: string; // Заголовок окна
  task: Task; // Задача для редактирования
  private categories: Category[]; // Выбор из всех категорий
  private priorities: Priority[]; // Выбор из всех приоритетов

  newTitle: string; // Сохраняем новое название во временную переменную, чтобы она не отразилась на самой задаче и изменения можно было отменить
  newCategoryId: number; // Сохраняем новую категорию
  newPriorityId: number; // Сохраняем новый приоритет
  newDate: Date; // Сохраняю новую дату

  oldCategoryId: number;

  isMobile: boolean;

  canDelete = true; // можно ли удалять объект (активна ли кнопка удаления)
  canComplete = true; // можно ли завершить задачу (зависит от текущего статуса)

  today = new Date(); // сегодняшняя дата

  constructor(
    // Работаем с текущим диалог. окном (запоминаем ссылку на него)
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,
    // Внедряем данные, которые получаем из родительского компонента
    @Inject(MAT_DIALOG_DATA)
    private data: [Task, string, Category[], Priority[]], // Данные, которые передали в диалоговое окно
    private dialog: MatDialog, // Для открытия нового диалогового окна из текущего (Желаете подтвердить? -Да, -Нет)
    private deviceService: DeviceDetectorService // для определения типа устройства
  ) {
    this.isMobile = deviceService.isMobile();
  }


  ngOnInit(): void {
    this.task = this.data[0]; // Получаем отредактированную задачу
    this.dialogTitle = this.data[1]; //Текст для заголовка
    this.categories = this.data[2];
    this.priorities = this.data[3];

    // если было передано значение, значит это редактирование (не создание новой задачи),
    // поэтому делаем удаление возможным (иначе скрываем иконку)
    if (this.task && this.task.id > 0) {
      this.canDelete = true;
      this.canComplete = true;
    }

    // чтобы в html странице корректно работали выпадающие списки - лучше работать не с объектами, а с их id
    if (this.task.priority) {
      this.newPriorityId = this.task.priority.id;
    }

    if (this.task.category) {
      this.newCategoryId = this.task.category.id;
      this.oldCategoryId = this.task.category.id; // старое значение категории всегда будет храниться тут
    }

    if (this.task.date) {
      // создаем new Date, чтобы переданная дата из задачи автоматически сконвертировалась в текущий timezone
      // (иначе будет показывать время UTC)
      this.newDate = new Date(this.task.date);
    }

    this.newTitle = this.task.title; // запоминаем старое название

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

  // Подтверждаем изменения
  onConfirm(): void {
    // считываем все значения для сохранения в поля задачи
    this.task.title = this.newTitle;
    this.task.priority = this.findPriorityById(this.newPriorityId);
    this.task.category = this.findCategoryById(this.newCategoryId);
    this.task.oldCategory = this.findCategoryById(this.oldCategoryId);

    if (!this.newDate) {
      this.task.date = null;
    } else {
      // в поле дата хранится в текущей timezone, в БД дата автоматически сохранится в формате UTC
      this.task.date = this.newDate;
    }

    // передаем добавленную/измененную задачу в обработчик
    // что с ним будут делать - уже на задача этого компонента
    this.dialogRef.close(new DialogResult(DialogAction.SAVE, this.task));}

  // нажали отмену (ничего не сохраняем и закрываем окно)
  cancel(): void {
    this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
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
      if (!(result)) { // если просто закрыли окно, ничего не нажав
        return;
      }
      if (result.action === DialogAction.OK) {
        this.dialogRef.close(new DialogResult(DialogAction.DELETE)); // нажали удалить
      }
    });
  }

  // Выполняем задачу
  complete() {
    this.dialogRef.close(new DialogResult(DialogAction.COMPLETE));
  }

  // Не выполняем задачу
  notComplete() {
    this.dialogRef.close(new DialogResult(DialogAction.ACTIVATE));
  }

  // поиск приоритета по id
  private findPriorityById(tmpPriorityId: number): Priority {
    return this.priorities.find(t => t.id === tmpPriorityId);
  }

  // поиск категории по id
  private findCategoryById(tmpCategoryId: number): Category {
    return this.categories.find(t => t.id === tmpCategoryId);
  }

  // установка даты + кол-во дней
  addDays(days: number) {
    this.newDate = new Date();
    this.newDate.setDate(this.today.getDate() + days);
  }

  // установка даты "сегодня"
  setToday() {
    this.newDate = this.today;
  }
}

