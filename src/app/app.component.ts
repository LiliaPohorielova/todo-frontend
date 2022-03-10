import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {DataHandlerService} from "./service/data-handler.service";
import {Category} from "./model/Category";
import {Priority} from "./model/Priority";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Todo';
  tasks: Task[];
  categories: Category[];
  priorities: Priority[];
  selectedCategory: Category = null;
  searchTaskText = '';
  statusFilter: boolean;
  priorityFilter: Priority;

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit() {
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
  }

  // Попадаем из дочернего компонента в родительский
  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.updateTasks();
  }

  onUpdateTask(task: Task) {
    this.dataHandler.updateTask(task).subscribe(task => {
      this.updateTasks()
    });
  }

  onDeleteTask(task: Task) {
    this.dataHandler.deleteTask(task.id).subscribe(task => {
      this.updateTasks()
    });
  }

  onUpdateCategory(category: Category) {
    this.dataHandler.updateCategory(category).subscribe(() => {
      this.onSelectCategory(this.selectedCategory);
    });
  }

  onDeleteCategory(category: Category) {
    this.dataHandler.deleteCategory(category.id).subscribe(cat => {
      this.selectedCategory = null; // Открываем категорию "Все"
      this.onSelectCategory(this.selectedCategory);
    });

  }

  // Поиск задач по названию
  onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasks();
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

  onAddTask(task: Task) {
    this.dataHandler.addTask(task).subscribe(
      result => {this.updateTasks()}
    );
  }
}
