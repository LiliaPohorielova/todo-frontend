import {BaseDAO} from "./BaseDAO";
import {Category} from "../../../model/Category";
import {Priority} from "../../../model/Priority";
import {Task} from "../../../model/Task";
import {Observable} from "rxjs";

export interface TaskDAO extends BaseDAO<Task> {

  // поиск задач по вссем параметрам
  // если какой-либо из них равен null, то он не будет учитываться
  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]>;

  // найти кол-во завершенных задач по категории
  // если категория = null, кол-во всех завершенных задач
  getCompletedCountByCategory(category: Category): Observable<number>;
  getUncompletedCountByCategory(category: Category): Observable<number>;
  getTotalCountByCategory(category: Category): Observable<number>;

  // кол-во задач всего
  getTotalCount(): Observable<number>;
}
