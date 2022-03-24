import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {concatMap, count, map, zip} from 'rxjs';
import {IntroService} from "./service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Умный компонент - раздает всем данные
export class AppComponent implements OnInit {

  // Tasks And Categories
  title = 'Todo';
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

  // Внедряем зависимости через конструктор
  constructor(
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

    this.fillCategories(); // заполнить меню с категориями

    this.onSelectCategory(null); // показать все задачи

    if (!this.isMobile && !this.isTablet)
      this.introService.startIntroJs(true);
  }

  /* Categories */

  onAddCategory(title: string) {
    // this.dataHandler.addCategory(title).subscribe(
    //   () => {
    //     this.fillCategories()
    //   }
    // );
  }

  onUpdateCategory(category: Category) {
    // this.dataHandler.updateCategory(category).subscribe(() => {
    //   this.onSearchCategory(this.searchCategoryText);
    // });
  }

  // Заполняем категории (ключ - наши категории, значения - кол-во невыполненных задач)
  fillCategories() {
    // if (this.categoryMap) {
    //   this.categoryMap.clear(); // предварительно очищаем
    // }
    //
    // // сортируем категории по алфавиту
    // this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));
    //
    // // считаем кол-во невыполненных задач
    // this.categories.forEach(cat => {
    //   this.dataHandler.getUncompletedCountInCategory(cat).subscribe(count => this.categoryMap.set(cat, count));
    // })
  }

  onDeleteCategory(category: Category) {
    // this.dataHandler.deleteCategory(category.id).subscribe(cat => {
    //   this.selectedCategory = null; // Открываем категорию "Все"
    //   this.categoryMap.delete(cat);
    //   this.onSearchCategory(this.searchCategoryText);
    //   this.updateTasks();
    // });
  }

  onSearchCategory(title: string) {
    // this.searchCategoryText = title;
    // this.dataHandler.searchCategories(title).subscribe(
    //   categories => {
    //     this.categories = categories;
    //     this.fillCategories();
    //   }
    // );
  }

  // Попадаем из дочернего компонента в родительский
  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.updateTasksAndStat();
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
