import { Observable, of } from "rxjs";
import {TaskDAO} from "../interfaces/TaskDAO";
import {Category} from "../../../model/Category";
import {Priority} from "../../../model/Priority";
import {TestData} from "../../TestData";

export class TaskDAOImpl implements TaskDAO {

  create(T: Task): Observable<Task> {
    // @ts-ignore
    return undefined;
  }

  delete(id: number): Observable<Task> {
    // @ts-ignore
    return undefined;
  }

  findAll(): Observable<Task[]> {
    // of - заворачивает данные в Observable
    // @ts-ignore
    return of(TestData.tasks);
  }

  findById(id: number): Observable<Task> {
    // @ts-ignore
    return of(TestData.tasks.find(todo => todo.id === id));
  }

  getCompletedCountByCategory(category: Category): Observable<number> {
    // @ts-ignore
    return undefined;
  }

  getTotalCount(): Observable<number> {
    // @ts-ignore
    return undefined;
  }

  getTotalCountByCategory(category: Category): Observable<number> {
    // @ts-ignore
    return undefined;
  }

  getUncompletedCountByCategory(category: Category): Observable<number> {
    // @ts-ignore
    return undefined;
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    // @ts-ignore
    return undefined;
  }

  update(T: Task): Observable<Task> {
    // @ts-ignore
    return undefined;
  }

}
