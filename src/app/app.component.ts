import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {Observable} from 'rxjs';
import {IntroService} from "./service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {CategorySearchValues, TaskSearchValues} from "./data/dao/search/SearchObjects";
import {CategoryService} from "./data/dao/impl/CategoryService";
import {TaskService} from "./data/dao/impl/TaskService";
import {PageEvent} from "@angular/material/paginator";
import {PriorityService} from "./data/dao/impl/PriorityService";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Умный компонент - раздает всем данные
export class AppComponent implements OnInit {

  // Tasks And Categories
  title = "Todo";
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];
  selectedCategory: Category = null;
  totalTasksFounded: number;

  // Search
  searchTaskText = '';
  searchCategoryText = '';
  showSearch: boolean;  // показать/скрыть поиск

  // Filters
  statusFilter: boolean;
  priorityFilter: Priority;

  // Statistic
  totalTasksCountInCategory: number;
  completedCountInCategory: number;
  uncompletedCountInCategory: number;
  uncompletedTotalTasksCount: number;

  showStatistic = true;

  // Menu
  menuOpened: boolean;
  showBackdrop: boolean;
  menuMode: any;
  menuPosition: any;

  // Adaptive layout
  isMobile: boolean;
  isTablet: boolean;

  // статистика
  uncompletedCountForCategoryAll: number;

  // показать/скрыть статистику
  showStat = true;

  // параметры поисков
  categorySearchValues = new CategorySearchValues(); // экземпляр можно создать тут же, т.к. не загружаем из cookies
  taskSearchValues = new TaskSearchValues();


  // Внедряем зависимости через конструктор
  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private priorityService: PriorityService,
    private dialog: MatDialog, // работа с диалог. окнами
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    // определяем тип устройства
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();

    this.showStatistic = !this.isMobile;
    this.showSearch = !this.isMobile;

    this.setMenuValues();
  }

  ngOnInit() {
    // для мобильных и планшетов - не показывать интро
    if (!this.isMobile && !this.isTablet) {
      // this.introService.startIntroJs(true);
    }
    // заполнить категории
    this.fillAllCategories().subscribe(res => {
      this.categories = res;
      // первоначальное отображение задач при загрузке приложения
      // запускаем только после выполнения статистики (т.к. понадобятся ее данные) и загруженных категорий
      this.selectCategory(this.selectedCategory);
    });
    // заполнить приоритеты
    this.fillAllPriorities();
  }

  /* Categories */

  // добавление категории
  addCategory(category: Category) {
    this.categoryService.create(category).subscribe(() => {
        // если вызов сервиса завершился успешно - добавляем новую категорию в локальный массив categories
        this.searchCategory(this.categorySearchValues);
      }
    );
  }

  // удаление категории
  deleteCategory(category: Category) {
    this.categoryService.delete(category.id).subscribe(() => {
      this.selectedCategory = null; // выбираем категорию "Все"
      // когда придет результат - обновим все категории в поиске
      this.searchCategory(this.categorySearchValues);
      this.selectCategory(this.selectedCategory);
    });
  }

  // обновлении категории
  updateCategory(category: Category) {
    this.categoryService.update(category).subscribe(() => {
      this.searchCategory(this.categorySearchValues); // обновляем список категорий
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }


  // заполняет категории и кол-во невыполненных задач по каждой из них (нужно для отображения категорий)
  fillAllCategories(): Observable<Category[]> {
    return this.categoryService.findAll();
  }


  // поиск категории
  searchCategory(categorySearchValues: CategorySearchValues) {
    this.categoryService.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
  }


  // изменение категории
  selectCategory(category: Category): void {
    // сбрасываем, чтобы показывать результат с первой страницы
    this.taskSearchValues.pageNumber = 0;
    this.selectedCategory = category;
    this.taskSearchValues.categoryId = category ? category.id : null;
    this.searchTasks(this.taskSearchValues);
    if (this.isMobile) {
      this.menuOpened = false; // для телефонов - автоматически скрываем боковое меню
    }
  }


  /* Tasks */

  addTask(task: Task) {
    this.taskService.create(task).subscribe(() => {
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }

  updateTask(task: Task) {
    this.taskService.update(task).subscribe(() => {
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }

  updateTasks() {
    // this.dataHandler.searchTasks(
    //   this.selectedCategory,
    //   this.searchTaskText,
    //   this.statusFilter,
    //   this.priorityFilter,
    // ).subscribe((tasks: Task[]) => {
    //   this.tasks = tasks;
    // });
  }

  onDeleteTask(task: Task) {
    this.taskService.delete(task.id).subscribe(() => {
      this.searchTasks(this.taskSearchValues); // обновляем список задач
    });
  }


  // Поиск задач
  searchTasks(searchTaskValues: TaskSearchValues) {
    this.taskSearchValues = searchTaskValues;
    this.taskService.searchTask(this.taskSearchValues).subscribe(result => {
      // Если выбранная страница для отображения больше, чем всего страниц - заново делаем поиск и показываем 1ю страницу.
      // Если пользователь был например на 2й странице общего списка и выполнил новый поиск, в результате которого доступна только 1 страница,
      // то нужно вызвать поиск заново с показом 1й страницы (индекс 0)
      if (result.totalPages > 0 && this.taskSearchValues.pageNumber >= result.totalPages) {
        this.taskSearchValues.pageNumber = 0;
        this.searchTasks(this.taskSearchValues);
      }
      this.totalTasksFounded = result.totalElements; // сколько данных показывать на странице
      this.tasks = result.content; // массив задач
    });
  }

  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasksAndStat();
  }

  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasksAndStat();
  }

  /* Priorities */

  // заполняет массив приоритетов
  fillAllPriorities() {
    this.priorityService.findAll().subscribe(result => {
      this.priorities = result;
    });
  }


  /* Statistic */

  updateTasksAndStat() {
    this.updateTasks(); //обновить список задач
    this.updateStat(); //обновить статистику
  }

  updateStat() {
    // zip( //Делает запрос на 4 переменные, ждет результатов, собирает всё в одном subscribe
    //   this.dataHandler.getTotalCountInCategory(this.selectedCategory),
    //   this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
    //   this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
    //   this.dataHandler.getUncompletedTotalCount())
    //
    //   .subscribe(array => {
    //     this.totalTasksCountInCategory = array[0];
    //     this.completedCountInCategory = array[1];
    //     this.uncompletedCountInCategory = array[2];
    //     this.uncompletedTotalTasksCount = array[3];
    //   });
  }

  toggleStatistic(showStatistic: boolean) {
    this.showStatistic = showStatistic;
  }

  // параметры меню
  setMenuValues() {
    this.menuPosition = 'left';

    if (this.isMobile) {
      this.menuOpened = false;
      this.menuMode = 'over';
      this.showBackdrop = true;
    } else {
      this.menuOpened = true;
      this.menuMode = 'push';
      this.showBackdrop = false;
    }
  }

  // показать скрыть меню
  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }

  // если закрыли меню любым способом - ставим значение false
  onClosedMenu() {
    this.menuOpened = false;
  }


  // изменили кол-во элементов на странице или перешли на другую страницу
  // с помощью paginator
  paging(pageEvent: PageEvent) {
    // если изменили настройку "кол-во на странице" - заново делаем запрос и показываем с 1й страницы
    if (this.taskSearchValues.pageSize !== pageEvent.pageSize) {
      this.taskSearchValues.pageNumber = 0; // новые данные будем показывать с 1-й страницы (индекс 0)
    } else {
      // если просто перешли на другую страницу
      this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    }
    this.taskSearchValues.pageSize = pageEvent.pageSize;
    this.taskSearchValues.pageNumber = pageEvent.pageIndex;
    this.searchTasks(this.taskSearchValues); // показываем новые данные
  }

  // показать-скрыть поиск
  toggleSearch(showSearch: boolean) {
    this.showSearch = showSearch;
  }
}
