import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../model/Task";
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {Priority} from "../../model/Priority";

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css']
})

// Редактирование задачи в диалоговом окне
export class EditTaskDialogComponent implements OnInit {

  constructor(
    // Работаем с текущим диалог. окном (запоминаем ссылку на него)
    private dialogRef: MatDialogRef<EditTaskDialogComponent>,

    // Внедряем данные, которые получаем из родительского компонента
    @Inject(MAT_DIALOG_DATA)
    private data: [Task, string], // Данные, которые передали в диалоговое окно

    private dataHandler: DataHandlerService, // Ссылка на сервис для работы с данными
    private dialog: MatDialog // Для открытия нового диалогового окна из текущего (Желаете подтвердить? -Да, -Нет)
  ) { }

  private dialogTitle: string; // Заголовок окна
  private task: Task; // Задача для редактирования
  private categories: Category[]; // Выбор из всех категорий
  private priorities: Priority[]; // Выбор из всех приоритетов
  tmpTitle: string; // Сохраняем новое название во временную переменную, чтобы она не отразилась на самой задаче и изменения можно было отменить
  tmpCategory: Category; // Сохраняем новую категорию
  tmpPriority: Priority; // Сохраняем новый приоритет


  get getDialogTitle(): string {
    return this.dialogTitle;
  }

  get getCategories(): Category[] {
    return this.categories;
  }

  get getPriorities(): Priority[] {
    return this.priorities;
  }

  ngOnInit(): void {
    this.task = this.data[0]; // Получаем отредактированную задачу
    this.dialogTitle = this.data[1]; //Текст для заголовка
    this.tmpTitle = this.task.title; // Отображаем то название, которое было раньше
    this.tmpCategory = this.task.category; // Категория, которая была раньше
    this.tmpPriority = this.task.priority; // Приоритет, который был раньше

    this.dataHandler.getAllCategories().subscribe(items => this.categories = items);
    this.dataHandler.getAllPriorities().subscribe(prior => this.priorities = prior);
  }

  // Подтверждаем изменения
  onConfirm(): void {
    this.task.title = this.tmpTitle; // Запоминаем новое название
    this.task.category = this.tmpCategory; // Запоминаем новую категорию
    this.task.priority = this.tmpPriority; // Запоминаем новый приоритет
    this.dialogRef.close(this.task);  // Закрываем диалоговое окно, передаем измененную задачу
  }

}
