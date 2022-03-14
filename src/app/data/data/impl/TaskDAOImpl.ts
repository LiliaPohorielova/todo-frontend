import {Observable, of} from "rxjs";
import {TaskDAO} from "../interfaces/TaskDAO";
import {Category} from "../../../model/Category";
import {Priority} from "../../../model/Priority";
import {Task} from "../../../model/Task";
import {TestData} from "../../TestData";

export class TaskDAOImpl implements TaskDAO {

  create(task: Task): Observable<Task> {
    if (task.id === null || task.id === 0) {
      task.id = this.getLastIdTask();
    }
    TestData.tasks.push(task);
    return of(task);
  }


  update(task: Task): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id === task.id); // Ищем по id
    /*
       indexOf() - ищет в массиве указанный элемент и возвращает его позицию

       splice() - удалить из массива/коллекции
       - начиная с какого индекса
       - сколько удалить
       - чем заменить
     */
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp), 1, task);

    return of(task); // заворачиваем в Observable
  }

  delete(id: number): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id === id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp),1);
    return of(taskTmp);
  }

  findAll(): Observable<Task[]> {
    // of - заворачивает данные в Observable
    return of(TestData.tasks);
  }

  findById(id: number): Observable<Task> {
    return of(TestData.tasks.find(todo => todo.id === id));
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTasks(category, searchText, status, priority));
  }

  // Поиск задач по параметрам
  private searchTasks(category: Category, searchText: string, status: boolean, priority: Priority): Task[] {
    let allTasks = TestData.tasks;

    if (status != null)
      allTasks = allTasks.filter(task => task.completed === status);

    if (category != null)
      allTasks = allTasks.filter(todo => todo.category === category);

    if (priority != null)
      allTasks = allTasks.filter(task => task.priority === priority);

    if (searchText != null) {
      allTasks = allTasks.filter(
        task => task.title.toUpperCase().includes(searchText.toUpperCase())
      );
    }

    return allTasks;
  }

  getLastIdTask() {
    return Math.max.apply(Math, TestData.tasks.map(task => task.id)) + 1;
  }

  // Statistic
  getTotalCountInCategory(category: Category): Observable<number> {
    return of(this.searchTasks(category, null, null,null).length);
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    return of(this.searchTasks(category, null, true,null).length);
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    return of(this.searchTasks(category, null, false,null).length);
  }

  getTotalCount(): Observable<number> {
    return of(TestData.tasks.length);
  }
}
