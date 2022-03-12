import {CategoryDAO} from "../interfaces/CategoryDAO";
import {Category} from "../../../model/Category";
import { Observable } from "rxjs/internal/Observable";
import {of} from "rxjs";
import {TestData} from "../../TestData";

export class CategoryDAOImpl implements CategoryDAO {

  create(category: Category): Observable<Category> {
    if (category.id === null || category.id === 0) {
      category.id = this.getLastIdCategory();
    }
    TestData.categories.push(category);
    return of(category);
  }

  update(category: Category): Observable<Category> {
    const tmpCategory = TestData.categories.find(t => t.id === category.id);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory),1, category);

    return of(tmpCategory);
  }

  delete(id: number): Observable<Category> {
    // Перед удалением - ставим в задачах null
    TestData.tasks.forEach(task => {
      if (task.category && task.category.id === id) {
        task.category = null;
      }
    });

    const tmpCategory = TestData.categories.find(t => t.id === id);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory),1);

    return of(tmpCategory);
  }

  findAll(): Observable<Category[]> {
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

  getLastIdCategory() {
    return Math.max.apply(Math, TestData.categories.map(cat => cat.id)) + 1;
  }
}
