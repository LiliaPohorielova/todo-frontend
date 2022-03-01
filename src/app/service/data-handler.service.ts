import {Injectable} from '@angular/core';
import {Category} from "../model/Category";
import {Task} from "../model/Task";
import {TestData} from "../data/TestData";

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  constructor() {  }

  getCategories(): Category[] {
    return TestData.categories;
  }

  getTasks(): Task[] {
    return TestData.tasks;
  }

  getTasksByCategories(category: Category): Task[] {
    const tasks = TestData.tasks.filter(task => task.category === category);
    return tasks;
  }
}
