import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro';

@Injectable({
  providedIn: 'root'
})
export class IntroService {

  private static INTRO_VIEWED_KEY = 'intro-viewed'; // ключ
  private static INTRO_VIEWED_VALUE = 'done'; // значение

  private introJS = introJs(); // объект по работе с intro

  constructor() { }

  // Показать интро с подсветкой элементов
  public startIntroJs(checkViewed: boolean) {
    // если раньше пользователь просмотрел интро - больше не показывать
    // localStorage - локальное хранилище в любом браузере (переменная самого TypeScript)
    if (checkViewed === true && localStorage.getItem(IntroService.INTRO_VIEWED_KEY) === IntroService.INTRO_VIEWED_VALUE) {
      return;
    }

    this.introJS.setOptions(
      {
        nextLabel: 'next >',
        prevLabel: '< prev',
        doneLabel: 'Exit',
        skipLabel: 'Skip',
        exitOnEsc: true,
        exitOnOverlayClick: false
      });

    this.introJS.start();

    // при закрытии - записываем информацию об этом, чтобы в след. раз не открывть интро еще раз
    this.introJS.onexit(() => localStorage.setItem(IntroService.INTRO_VIEWED_KEY, IntroService.INTRO_VIEWED_VALUE));
  }
}
