import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {Task} from "../model/Task";
import {TestData} from "../data/TestData";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  // @ts-ignore
  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  // @ts-ignore
  categorySubject = new BehaviorSubject<Category[]>(TestData.categories);

  constructor() {
    this.fillTasks();
  }

  fillTasks() {
    // @ts-ignore
    this.taskSubject.next(TestData.tasks);
  }

  fillTasksByCategories(category: Category) {
    const tasks = TestData.tasks.filter(task => task.category === category);
    // @ts-ignore
    this.taskSubject.next(tasks);
  }
}
