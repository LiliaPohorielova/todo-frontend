import {BaseDAO} from "./BaseDAO";
import {Category} from "../../../model/Category";
import { Observable } from "rxjs";

export interface CategoryDAO extends BaseDAO<Category> {

  search(title: string): Observable<Category[]>;
}
