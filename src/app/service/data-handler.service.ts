import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {Task} from "../model/Task";
import {TestData} from "../data/TestData";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {TaskDAOImpl} from "../data/data/impl/TaskDAOImpl";
import {CategoryDAOImpl} from "../data/data/impl/CategoryDAOImpl";
import {Priority} from "../model/Priority";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categorySubject = new BehaviorSubject<Category[]>(TestData.categories);
  private taskDao = new TaskDAOImpl();
  private categoryDao = new CategoryDAOImpl();

  constructor() {
    this.fillTasks();
  }

  fillTasks() {
    this.taskSubject.next(TestData.tasks);
  }

  fillTasksByCategories(category: Category) {
    const tasks = TestData.tasks.filter(task => task.category === category);
    this.taskSubject.next(tasks);
  }

  findAllTasks(): Observable<Task[]> {
    return this.taskDao.findAll();
  }

  findAllCategories(): Observable<Category[]>{
    return this.categoryDao.findAll();
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDao.update(task);
  }

  searchTasks(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return this.taskDao.search(category, searchText, status, priority);
  }
}
