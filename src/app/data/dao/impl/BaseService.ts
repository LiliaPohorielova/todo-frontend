import { Observable } from "rxjs/internal/Observable";
import {HttpClient} from "@angular/common/http";
import {BaseModel} from "../../../model/BaseModel";

export class BaseService<T extends BaseModel> {

  private readonly url: string;

  constructor(url: string,
              private httpClient: HttpClient) {
    // библиотека, которая позволяет преобразовывать объект из JSON и обратно
    // выполняет HTTP-запросы get, put, post, delete
    this.url = url;
  }

  create(t: T): Observable<T> {
    return this.httpClient.post<T>(this.url + '/add', t);
  }

  update(t: T): Observable<T> {
    return this.httpClient.put<T>(this.url + '/edit/' + t.id, t);
  }

  delete(id: number): Observable<T> {
    return this.httpClient.delete<T>(this.url + '/delete/' + id);
  }

  findAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.url + '/all');
  }

  findById(id: number): Observable<T> {
    return this.httpClient.get<T>(this.url + '/id/' + id);
  }
}
