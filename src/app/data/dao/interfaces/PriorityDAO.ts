import {BaseDAO} from "./BaseDAO";
import {Priority} from "../../../model/Priority";
import {Observable} from "rxjs";
import {PrioritySearchValues} from "../search/SearchObjects";

export interface PriorityDAO extends BaseDAO<Priority> {

  // поиск приоритетов
  searchPriorities(prioritySearchValues: PrioritySearchValues): Observable<any>;

}
