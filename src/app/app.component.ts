import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {concatMap, count, map, zip} from 'rxjs';
import {IntroService} from "./service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {CategorySearchValues} from "./data/dao/search/SearchObjects";
import {CategoryService} from "./data/dao/impl/CategoryService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Умный компонент - раздает всем данные
export class AppComponent implements OnInit {

  // Tasks And Categories
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];
  selectedCategory: Category = null;
  categoryMap = new Map<Category, number>();

  // Search
  searchTaskText = '';
  searchCategoryText = '';

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


  // Внедряем зависимости через конструктор
  constructor(
    private categoryService: CategoryService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    // определяем тип устройства
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();

    this.showStatistic = !this.isMobile;

    this.setMenuValues();
  }

  ngOnInit() {
    // this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    // this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);

    this.fillAllCategories(); // заполнить меню с категориями

    this.selectCategory(null); // показать все задачи

    if (!this.isMobile && !this.isTablet)
      this.introService.startIntroJs(true);
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
      // когда придет результат - обновим все категории в поиске
      this.searchCategory(this.categorySearchValues);
    });
  }

  // обновлении категории
  updateCategory(category: Category) {
    this.categoryService.update(category).subscribe(() => {
      this.searchCategory(this.categorySearchValues);
    });
  }


  // заполняет категории и кол-во невыполненных задач по каждой из них (нужно для отображения категорий)
  fillAllCategories() {
    this.categoryService.findAll().subscribe(result => {
      this.categories = result;
    });
  }

  // поиск категории
  searchCategory(categorySearchValues: CategorySearchValues) {
    this.categoryService.findCategories(categorySearchValues).subscribe(result => {
      this.categories = result;
    });
  }


  // изменение категории
  selectCategory(category: Category): void {


  }


  /* Tasks */

  onAddTask(task: Task) {
    // this.dataHandler.addTask(task).pipe( //сначала добавляем задачу
    //   concatMap(task => { // используем добавленный task (concatMap - для последовательного
    //       // .. и считаем кол-во задач в категории с учетом новой (только что добавленной задачи)
    //       return this.dataHandler.getUncompletedCountInCategory(task.category).pipe(map(count => {
    //         return ({t: task, count}); // получили массив с добавленной задачей
    //       }));
    //     }
    //   )).subscribe(result => {
    //   const t = result.t as Task;
    //
    //   if (t.category) {
    //     this.categoryMap.set(t.category, result.count);
    //   }
    //   this.updateTasksAndStat();
    // });
  }

  onUpdateTask(task: Task) {
    // this.dataHandler.updateTask(task).subscribe(() => {
    //   this.fillCategories();
    //   this.updateTasksAndStat();
    // });
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
    // // сначала удаляем задачу, ждем (пока не удалиться - ничего дальше не выполнять), потом смотрим сколько невыполненных осталось
    // this.dataHandler.deleteTask(task.id).pipe(
    //   // pipe() - позволяет последовательно выполнить две операции Observable
    //   concatMap(t => { // используем добавленный task (concatMap - для последовательного
    //       return this.dataHandler.getUncompletedCountInCategory(t.category).pipe(map(count => {
    //         return ({t, count}); // получили мапу с ключом и значением
    //       }));
    //     }
    //   )).subscribe(result => {
    //
    //   const t = result.t as Task;
    //   this.categoryMap.set(t.category, result.count);
    //
    //   this.updateTasksAndStat();
    // });
  }


  // Поиск задач по названию
  onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasksAndStat();
  }

  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasksAndStat();
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

  onClosedMenu() {
    this.menuOpened = false;
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
}
