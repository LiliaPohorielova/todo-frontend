import {Observable} from "rxjs";
import {TaskDAO} from "../interfaces/TaskDAO";
import {Task} from "../../../model/Task";
import {Inject, Injectable, InjectionToken} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TaskSearchValues} from "../search/SearchObjects";
import {BaseService} from "./BaseService";


// глобальная переменная (хранится в app.module.ts - providers)
export const TASK_URL_TOKEN = new InjectionToken<string>('url')


@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<Task> implements TaskDAO {

  constructor(
    @Inject(TASK_URL_TOKEN)
    private baseUrl,
    private http: HttpClient) { // библиотека, которая позволяет преобразовывать объект из JSON и обратно
    // выполняет HTTP-запросы get, put, post, delete
    super(baseUrl, http);
  }

  searchTask(taskSearchValues: TaskSearchValues): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/search', taskSearchValues);
  }
}
