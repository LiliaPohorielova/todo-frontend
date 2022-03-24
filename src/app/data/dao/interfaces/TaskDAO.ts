import {BaseDAO} from "./BaseDAO";
import {Task} from "../../../model/Task";
import {Observable} from "rxjs";
import {TaskSearchValues} from "../search/SearchObjects";

export interface TaskDAO extends BaseDAO<Task> {

  // поиск задач по всем параметрам из TaskSearchValues
  // если какой-либо из них равен null, то он не будет учитываться
  searchTask(taskSearchValues : TaskSearchValues): Observable<any>;

}
