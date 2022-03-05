import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataHandlerService} from "../../../service/data-handler.service";
import {Task} from "../../../model/Task";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit {

  // поля таблицы (названия колонок)
  private _displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category'];
  private _dataSource: MatTableDataSource<Task>; //контейнер - источник данных для таблицы

  get dataSource(): MatTableDataSource<Task> {
    return this._dataSource;
  }
  get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  // Данные компоненты будут иметь ссылки на объекты в HTML
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;

  public tasks: Task[];

  // Передаем список задач с помощью Input на Set
  @Input('tasks')
  public set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit() {
    //this.dataHandler.findAllTasks().subscribe(tasks => this.tasks = tasks);
    this._dataSource = new MatTableDataSource();
    this.fillTable(); //заполняем таблицу данными и говорим ей как сортировать
  }

  // Метод вызывается после инициализации (сначала все данные попали в таблицу, а потом мы с ними можем работать, сортировать и тд)
  ngAfterViewInit() {
    this.addTableObjects();
  }

  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  //в зависимости от статуса - вернуть цвет
  public getPriorityColor(task: Task) {
    if (task.completed) {
      return "#F8F9FA";
    }
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return '#fff';
  }

  //показывает задачи учитывая поиск, фильтр, категории
  private fillTable() {
    if (!this._dataSource) return;
    this._dataSource.data = this.tasks; //обновить источник данных для таблицы
    this.addTableObjects(); // добавляем визуальные объекты

    // объесняем сортировщику как и по чем сортировать
    // @ts-ignore: ошибка с датой (можно возвращать любой тип)
    this._dataSource.sortingDataAccessor = (task, colName) => {
      switch (colName) {
        case 'priority': {
          return task.priority ? task.priority.id : null;
        }
        case 'category': {
          return task.category ? task.category.title : null;
        }
        case 'date': {
          return task.date ? task.date : null;
        }
        case 'title': {
          return task.title;
        }
      }
    }
  }

  // Отправляем данные, с которыми нужно работать
  private addTableObjects() {
    this._dataSource.sort = this.sort;
    this._dataSource.paginator = this.paginator;
  }
}
