import {CategoryDAO} from "../interfaces/CategoryDAO";
import {Category} from "../../../model/Category";
import { Observable } from "rxjs/internal/Observable";
import {of} from "rxjs";
import {TestData} from "../../TestData";

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
    return of(TestData.categories);
  }

  findById(id: number): Observable<Category> {
    // @ts-ignore
    return of(TestData.categories.find(cat => cat.id === id));
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
