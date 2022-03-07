import {Observable, of} from "rxjs";
import {TaskDAO} from "../interfaces/TaskDAO";
import {Category} from "../../../model/Category";
import {Priority} from "../../../model/Priority";
import {Task} from "../../../model/Task";
import {TestData} from "../../TestData";

export class TaskDAOImpl implements TaskDAO {

  create(task: Task): Observable<Task> {
    return undefined;
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
    return undefined;
  }

  findAll(): Observable<Task[]> {
    // of - заворачивает данные в Observable
    return of(TestData.tasks);
  }

  findById(id: number): Observable<Task> {
    return of(TestData.tasks.find(todo => todo.id === id));
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTodos(category, searchText, status, priority));
  }

  // Поиск задач по параметрам
  private searchTodos(category: Category, searchText: string, status: boolean, priority: Priority): Task[] {
    let allTasks = TestData.tasks;
    if (category != null)
      allTasks = allTasks.filter(todo => todo.category === category);
    return allTasks;
  }

  getCompletedCountByCategory(category: Category): Observable<number> {
    return undefined;
  }

  getTotalCount(): Observable<number> {
    return undefined;
  }

  getTotalCountByCategory(category: Category): Observable<number> {
    return undefined;
  }

  getUncompletedCountByCategory(category: Category): Observable<number> {
    return undefined;
  }

}
