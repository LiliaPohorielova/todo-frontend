import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "../../../model/Task";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {MatDialog} from '@angular/material/dialog';
import {Category} from "../../../model/Category";
import {DeviceDetectorService} from "ngx-device-detector";
import {TaskSearchValues} from "../../../data/dao/search/SearchObjects";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  // ----------------------- входящие параметры ----------------------------

  // переменные для настройки постраничности должны быть проинициализированы первыми (до обновления tasks)
  // чтобы компонент постраничности правильно отработал

  @Input()
  totalTasksFounded: number; // сколько всего задач найдено

  // задачи для отображения на странице
  @Input('tasks')
  set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.assignTableSource();   // передать данные таблице для отображения задач
  }

  // все возможные параметры для поиска задач
  @Input('taskSearchValues')
  set setTaskSearchValues(taskSearchValues: TaskSearchValues) {
    this.taskSearchValues = taskSearchValues;
  }


  // ----------------------- исходящие действия----------------------------

  @Output()
  addTask = new EventEmitter<Task>();

  @Output()
  deleteTask = new EventEmitter<Task>();

  @Output()
  updateTask = new EventEmitter<Task>();

  @Output()
  selectCategory = new EventEmitter<Category>(); // нажали на категорию из списка задач

  @Output()
  paging = new EventEmitter<PageEvent>(); // переход по страницам данных

  @Output()
  searchAction = new EventEmitter<TaskSearchValues>(); // переход по страницам данных


  // -------------------------------------------------------------------------


  tasks: Task[]; // текущий список задач для отображения

  // поля для таблицы (те, что отображают данные из задачи - должны совпадать с названиями переменных класса)
  displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>(); // источник данных для таблицы


  isMobile: boolean; // мобильное ли устройство

  // параметры поиска задач - первоначально данные загружаются из cookies (в app.component)
  taskSearchValues: TaskSearchValues;


  // цвета
  readonly colorCompletedTask = '#F8F9FA';
  readonly colorWhite = '#fff';


  constructor(
    private dialog: MatDialog, // работа с диалоговым окном
    private deviceService: DeviceDetectorService // для определения типа устройства
  ) {
    this.isMobile = this.deviceService.isMobile();
  }


  ngOnInit() {
  }


  // передать данные таблице для отображения задач
  assignTableSource() {
    // датасорс обязательно нужно создавать для таблицы, в него присваивается любой источник (БД, массивы, JSON и пр.)
    if (!this.dataSource) {
      return;
    }
    this.dataSource.data = this.tasks; // обновить источник данных (т.к. данные массива tasks обновились)

  }

  // диалоговое окно для добавления задачи
  openAddDialog() {


  }

  // диалоговое редактирования для добавления задачи
  openEditDialog(task: Task): void {


  }


  // диалоговое окно подтверждения удаления
  openDeleteDialog(task: Task) {

  }


  // нажали/отжали выполнение задачи
  onToggleCompleted(task: Task) {


  }


  // в зависимости от статуса задачи - вернуть цвет
  getPriorityColor(task: Task) {

    // если задача завершена - возвращаем цвет
    if (task.completed) {
      return this.colorCompletedTask;
    }

    // вернуть цвет приоритета, если он указан
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }

    return this.colorWhite;

  }

  // в зависимости от статуса задачи - вернуть фоновый цвет
  getPriorityBgColor(task: Task) {

    if (task.priority != null && !task.completed) {
      return task.priority.color;
    }

    return 'none';
  }


  // в это событие попадает как переход на другую страницу (pageIndex), так и изменение кол-ва данных на страниц (pageSize)
  pageChanged(pageEvent: PageEvent) {
    this.paging.emit(pageEvent);
  }
}
