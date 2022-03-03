import {PriorityDAO} from "../interfaces/PriorityDAO";
import {Priority} from "../../../model/Priority";
import { Observable } from "rxjs/internal/Observable";

export class PriorityDAOImpl implements PriorityDAO {

  create(T: Priority): Observable<Priority> {
    // @ts-ignore
    return undefined;
  }

  delete(id: number): Observable<Priority> {
    // @ts-ignore
    return undefined;
  }

  findAll(): Observable<Priority[]> {
    // @ts-ignore
    return undefined;
  }

  findById(id: number): Observable<Priority> {
    // @ts-ignore
    return undefined;
  }

  update(T: Priority): Observable<Priority> {
    // @ts-ignore
    return undefined;
  }

}
