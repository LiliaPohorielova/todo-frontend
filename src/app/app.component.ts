import {Component, OnInit} from '@angular/core';
import {Task} from "./model/Task";
import {DataHandlerService} from "./service/data-handler.service";
import {Category} from "./model/Category";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Todo';
  tasks: Task[];
  categories: Category[];
  selectedCategory: Category;

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit() {
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
  }

  // Попадаем из дочернего компонента в родительский
  onSelectCategory(category: Category) {
    this.selectedCategory = category;
    this.dataHandler.searchTasks(
      this.selectedCategory, null, null, null
    ).subscribe(tasks => this.tasks = tasks); // как только данные измениться - они применяться
  }

  onUpdateTask(task: Task) {
    // НЕ использовать subscribe() внутри subscribe()!!!
    this.dataHandler.updateTask(task).subscribe(() => {
      this.dataHandler.searchTasks(
        this.selectedCategory,
        null,
        null,
        null
      ).subscribe(tasks => {
        this.tasks = tasks;
      })
    })
  }

  onDeleteTask(task: Task) {
    // НЕ использовать subscribe() внутри subscribe()!!!
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.dataHandler.searchTasks(
        this.selectedCategory,
        null,
        null,
        null
      ).subscribe(tasks => {
        this.tasks = tasks;
      })
    })
  }
}
