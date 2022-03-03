import {BaseDAO} from "./BaseDAO";
import {Category} from "../../../model/Category";

export interface CategoryDAO extends BaseDAO<Category> {

  search(title: string): Observable<Category[]>;
}
