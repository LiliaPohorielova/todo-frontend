import {Observable} from "rxjs";
import {Inject, Injectable, InjectionToken} from "@angular/core";
import {StatisticDAO} from "../interfaces/StatisticDAO";
import {HttpClient} from "@angular/common/http";
import {Statistic} from "../../../model/Statistic";

// глобальная переменная (хранится в app.module.ts - providers)
export const STATISTIC_URL_TOKEN = new InjectionToken<string>('url')

@Injectable({
  providedIn: 'root'
})
export class StatisticService implements StatisticDAO {

  constructor(@Inject(STATISTIC_URL_TOKEN)
              private baseUrl,
              private httpClient: HttpClient) { // библиотека, которая позволяет преобразовывать объект из JSON и обратно
    // выполняет HTTP-запросы get, put, post, delete
  }

  getStatistic(): Observable<Statistic> {
    return this.httpClient.get<Statistic>(this.baseUrl);
  }

}
