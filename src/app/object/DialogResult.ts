// используется в диалоговых окнах, где может быть множество действий с результатом, а не только ОК и отмена

export class DialogResult {
  action: DialogAction;
  obj: any;


  // ? означает необязательный параметр
  constructor(action: DialogAction, obj?: any) {
    this.action = action;
    this.obj = obj;
  }
}

// всевозможные действия в диалоговом окне (можно разбить по разным enum)
export enum DialogAction {
  SETTINGS_CHANGE, // настройки были изменены
  SAVE, // сохранение изменений
  OK, // для подтверждения действий
  CANCEL, // отмена всех действий
  DELETE, // удаление объекта
  COMPLETE, // завершение задачи
  ACTIVATE// возврат задачи в активное состояние (нерешенная)
}
