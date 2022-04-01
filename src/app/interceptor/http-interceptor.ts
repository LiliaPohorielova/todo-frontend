import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {SpinnerService} from "../service/spinner.service";
import {Observable, tap} from "rxjs";

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  // перехватили все http-запросы
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.show(); // показать спиннер
    return next
      .handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) { // если пришел ответ - response от сервера
            this.spinnerService.hide(); // когда запрос выполнился - убрать спиннер
          }
        }, (error) => {
          this.spinnerService.hide(); // если возникла ошибка - убрать спиннер
          })
      );
  }
}
