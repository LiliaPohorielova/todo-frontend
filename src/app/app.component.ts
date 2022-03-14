import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {DataHandlerService} from "./service/data-handler.service";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";
import {zip} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Tasks
  title = 'Todo';
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];
  selectedCategory: Category = null;

  // Search
  searchTaskText = '';
  searchCategoryText = '';

  // Filters
  statusFilter: boolean;
  priorityFilter: Priority;

  //Statistic
  totalTasksCountInCategory: number;
  completedCountInCategory: number;
  uncompletedCountInCategory: number;
  uncompletedTotalTasksCount: number;

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit() {
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
  }

  /* Categories */

  onAddCategory(title: string) {
    this.dataHandler.addCategory(title).subscribe(
      () => {
        this.updateCategories()
      }
    );
  }

  onUpdateCategory(category: Category) {
    this.dataHandler.updateCategory(category).subscribe(() => {
      this.onSearchCategory(this.searchCategoryText);
    });
  }

  updateCategories() {
    this.dataHandler.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  onDeleteCategory(category: Category) {
    this.dataHandler.deleteCategory(category.id).subscribe(cat => {
      this.selectedCategory = null; // Открываем категорию "Все"
      this.onSearchCategory(this.searchCategoryText);
      this.updateTasks();
    });
  }

  onSearchCategory(title: string) {
    this.searchCategoryText = title;
    this.dataHandler.searchCategories(title).subscribe(
      categories => {
        this.categories = categories
      }
    );
  }

  // Попадаем из дочернего компонента в родительский
  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.updateTasksAndStat();
  }


  /* Tasks */

  onAddTask(task: Task) {
    this.dataHandler.addTask(task).subscribe(
      result => {
        this.updateTasksAndStat()
      }
    );
  }

  onUpdateTask(task: Task) {
    this.dataHandler.updateTask(task).subscribe(task => {
      this.updateTasksAndStat()
    });
  }

  updateTasks() {
    this.dataHandler.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter,
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onDeleteTask(task: Task) {
    this.dataHandler.deleteTask(task.id).subscribe(task => {
      this.updateTasksAndStat()
    });
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
    zip( //Делает запрос на 4 переменные, ждет результатов, собирает всё в одном subscribe
      this.dataHandler.getTotalCountInCategory(this.selectedCategory),
      this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedTotalCount())

      .subscribe(array => {
        this.totalTasksCountInCategory = array[0];
        this.completedCountInCategory = array[1];
        this.uncompletedCountInCategory = array[2];
        this.uncompletedTotalTasksCount = array[3];
      });
  }
}
