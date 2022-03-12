import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataHandlerService} from "../../../service/data-handler.service";
import {Task} from "../../../model/Task";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from '@angular/material/dialog';
import {EditTaskDialogComponent} from "../../../dialog/edit-task-dialog/edit-task-dialog.component";
import {ConfirmDialogComponent} from "../../../dialog/confirm-dialog/confirm-dialog.component";
import {Category} from "../../../model/Category";
import {Priority} from "../../../model/Priority";
import {OperationType} from "../../../dialog/OperationType";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit {

  // Данные компоненты будут иметь ссылки на объекты в HTML
  @ViewChild(MatPaginator, {static: false}) private paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) private sort: MatSort;

  @Output()
  addTask = new EventEmitter<Task>();

  @Output()
  updateTask = new EventEmitter<Task>();

  @Output()
  deleteTask = new EventEmitter<Task>();

  @Output()
  selectCategory = new EventEmitter<Category>(); // Нажали на кегорию из общей таблицы задач

  @Output()
  filterByTitle = new EventEmitter<string>();

  @Output()
  filterByStatus = new EventEmitter<boolean>();

  @Output()
  filterByPriority = new EventEmitter<Priority>();

  tasks: Task[];
  priorities: Priority[];

  // Поиск
  searchTaskText: string;
  selectedStatusFilter: boolean = null;   // по-умолчанию будут показываться все задачи
  selectedPriorityFilter: Priority = null;

  @Input()
  selectedCategory: Category;

  // Передаем список задач с помощью Input на Set
  @Input('tasks')
  public set setTasks(tasks: Task[]) {
    this.tasks = tasks;
    this.fillTable();
  }

  @Input('priorities')
  public set setPriorities(priorities: Priority[]) {
    this.priorities = priorities;
    this.fillTable();
  }

  // Поля таблицы (названия колонок)
  private displayedColumns: string[] = ['color', 'id', 'title', 'date', 'priority', 'category', 'operations', 'select'];
  private dataSource: MatTableDataSource<Task>; //контейнер - источник данных для таблицы

  get getDataSource(): MatTableDataSource<Task> {
    return this.dataSource;
  }

  get getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }

  // Внедрение с помощью конструктора
  constructor(
    private dataHandler: DataHandlerService, // Доступ к данным
    private dialog: MatDialog // Работа с диалоговым окном
  ) {
  }

  ngOnInit() {
    //this.dataHandler.findAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataSource = new MatTableDataSource();
    this.fillTable(); //заполняем таблицу данными и говорим ей как сортировать
  }

  // Метод вызывается после инициализации (сначала все данные попали в таблицу, а потом мы с ними можем работать, сортировать и тд)
  ngAfterViewInit() {
    this.addTableObjects();
  }

  // В зависимости от статуса - вернуть цвет
  public getPriorityColor(task: Task): string {
    if (task.completed) {
      return "#F8F9FA";
    }
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return '#fff';
  }

  get getPriorities(): Priority[] {
    return this.priorities;
  }

  // Показывает задачи учитывая поиск, фильтр, категории
  private fillTable(): void {
    if (!this.dataSource) return;
    this.dataSource.data = this.tasks; //обновить источник данных для таблицы
    this.addTableObjects(); // добавляем визуальные объекты

    // Объясняем сортировщику как и по чем сортировать
    // @ts-ignore: ошибка с датой (можно возвращать любой тип)
    this.dataSource.sortingDataAccessor = (task, colName) => {
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
  private addTableObjects(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  // Диалоговое окно добавления новой задачи
  openAddTaskDialog() {
    const task = new Task(null, '', false, null, this.selectedCategory);
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, "Add task", OperationType.ADD], autoFocus: false});

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addTask.emit(task);
    });
  }

  // Диалоговое окно редактирования задачи
  openEditTaskDialog(task: Task): void {

    // Открытие диалогового окна
    // Метод оpen (передаем компонент диалогового окна и настройки, типо: название, автофокус, положение и тд)
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, "Edit tasks", OperationType.EDIT], autoFocus: false});
    // Подписывваемся на результат (реактивный стиль Observable)
    dialogRef.afterClosed().subscribe(result => {
      // Обработка результата (то, что нам пришло после закрытия диалогового окна)

      if (result === 'delete') { // Удаляем задачу
        this.deleteTask.emit(task);
        return;
      }

      if (result === 'complete') {
        task.completed = true; // Выполняем задачу
        this.updateTask.emit(task);
        return;
      }

      if (result === 'notComplete') {
        task.completed = false; // Выполняем задачу
        this.updateTask.emit(task);
        return;
      }

      if (result as Task) { // Если есть результат - преобразовываем его в Task
        this.updateTask.emit(task);
        return;
      }
    });
  }

  openDeleteDialog(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Action confirmation',
        message: 'Do you really want to delete the task:\n' + task.title + '?'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deleteTask.emit(task); // Нажали удалить
    });
  }

  onToggleStatus(task: Task) {
    task.completed = !task.completed;
    this.updateTask.emit(task);
  }

  onSelectCategory(category: Category) {
    this.selectCategory.emit(category);
  }

  // Поиск по названию
  onFilterByTitle() {
    this.filterByTitle.emit(this.searchTaskText);
  }

  // Фильтрация по статусу
  onFilterByStatus(value: boolean) {
    // На всякий случай проверяем
    if (value != this.selectedStatusFilter) {
      this.selectedStatusFilter = value;
      this.filterByStatus.emit(this.selectedStatusFilter);
    }
  }

  // Фильтрация по приоритету
  onFilterByPriority(priority: Priority) {
    if (priority != this.selectedPriorityFilter) {
      this.selectedPriorityFilter = priority;
      this.filterByPriority.emit(this.selectedPriorityFilter);
    }
  }
}
