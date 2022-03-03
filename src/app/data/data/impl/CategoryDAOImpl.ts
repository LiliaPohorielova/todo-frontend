import {CategoryDAO} from "../interfaces/CategoryDAO";
import {Category} from "../../../model/Category";
import { Observable } from "rxjs/internal/Observable";

export class CategoryDAOImpl implements CategoryDAO {

  create(T: Category): Observable<Category> {
    // @ts-ignore
    return undefined;
  }

  delete(id: number): Observable<Category> {
    // @ts-ignore
    return undefined;
  }

  findAll(): Observable<Category[]> {
    // @ts-ignore
    return undefined;
  }

  findById(id: number): Observable<Category> {
    // @ts-ignore
    return undefined;
  }

  search(title: string): Observable<Category[]> {
    // @ts-ignore
    return undefined;
  }

  update(T: Category): Observable<Category> {
    // @ts-ignore
    return undefined;
  }

}
