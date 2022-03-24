import {CategoryDAO} from "../interfaces/CategoryDAO";
import {Category} from "../../../model/Category";
import {Observable} from "rxjs/internal/Observable";
import {Inject, Injectable, InjectionToken} from "@angular/core";
import {CategorySearchValues} from "../search/SearchObjects";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./BaseService";

// глобальная переменная (хранится в app.module.ts - providers)
export const CATEGORY_URL_TOKEN = new InjectionToken<string>('url')

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<Category> implements CategoryDAO {

  constructor(
    @Inject(CATEGORY_URL_TOKEN)
    private baseUrl,
    private http: HttpClient) { // библиотека, которая позволяет преобразовывать объект из JSON и обратно
    // выполняет HTTP-запросы get, put, post, delete
    super(baseUrl, http)
  }

  searchCategories(categorySearchValues: CategorySearchValues): Observable<any> {
    return this.http.post<Category[]>(this.baseUrl + '/search', CategorySearchValues);
  }
}
