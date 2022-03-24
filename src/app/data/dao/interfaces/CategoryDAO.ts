import {BaseDAO} from "./BaseDAO";
import {Category} from "../../../model/Category";
import { Observable } from "rxjs";
import {CategorySearchValues} from "../search/SearchObjects";

export interface CategoryDAO extends BaseDAO<Category> {

  //поиск категорий по любым параметрам CategorySearchValues
  findCategories(categorySearchValues: CategorySearchValues): Observable<any>;

}
