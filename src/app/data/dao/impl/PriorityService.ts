import {PriorityDAO} from '../interfaces/PriorityDAO';
import {Priority} from '../../../model/Priority';
import {Observable} from 'rxjs';
import {Inject, Injectable, InjectionToken} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PrioritySearchValues} from "../search/SearchObjects";
import {BaseService} from "./BaseService";

// глобальная переменная (хранится в app.module.ts - providers)
export const PRIORITY_URL_TOKEN = new InjectionToken<string>('url')

// все методы DAO возвращают тип Observable, для реактивных возможностей
// для работы с БД - каждый метод делал RESFull запрос к БД
@Injectable({
  providedIn: 'root'
})
export class PriorityService extends BaseService<Priority> implements PriorityDAO {

  constructor(
    @Inject(PRIORITY_URL_TOKEN)
    private baseUrl,
    private http: HttpClient) { // библиотека, которая позволяет преобразовывать объект из JSON и обратно
    // выполняет HTTP-запросы get, put, post, delete
    super(baseUrl, http)
  }

  searchPriorities(prioritySearchValues: PrioritySearchValues): Observable<any> {
    return this.http.post<Priority[]>(this.baseUrl + '/search', PrioritySearchValues);
  }
}
