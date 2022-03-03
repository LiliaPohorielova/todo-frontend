import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {Task} from "../model/Task";
import {TestData} from "../data/TestData";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {TaskDAOImpl} from "../data/data/impl/TaskDAOImpl";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  // @ts-ignore
  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  // @ts-ignore
  categorySubject = new BehaviorSubject<Category[]>(TestData.categories);
  private taskDao = new TaskDAOImpl();

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

  findAllTasks(): Observable<Task[]>{
    // @ts-ignore
    return this.taskDao.findAll();
  }
}
