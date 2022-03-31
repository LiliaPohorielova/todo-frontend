import { Component, OnInit } from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialogRef} from "@angular/material/dialog";
import {PriorityService} from "../../data/dao/impl/PriorityService";
import {DialogAction, DialogResult} from "../../object/DialogResult";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  priorities: Priority[]; // список приоритетов для редактирования/удаления
  settingsChanged = false; // были ли изменены настройки

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалог. окном
    private priorityService: PriorityService // ссылка на сервис для работы с данными
  ) {
  }


  ngOnInit() {
    // получаем все значения, чтобы отобразить настройку цветов
    this.priorityService.findAll().subscribe(priorities => this.priorities = priorities);
  }

  // нажали Закрыть
  close(): void {
    if (this.settingsChanged) { // если в настройках произошли изменения
      this.dialogRef.close(new DialogResult(DialogAction.SETTINGS_CHANGE, this.priorities));
    } else {
      this.dialogRef.close(new DialogResult(DialogAction.CANCEL));
    }
  }


  // добавили приоритет
  addPriority(priority: Priority): void {
    this.settingsChanged = true; // в настройках произошли изменения
    // сначала обновить в БД
    this.priorityService.create(priority).subscribe(result => {
      // т.к. данные простые и без сортировки - то можно просто добавить объект в локальный массив,
      // а не запрашивать заново из БД
      this.priorities.push(result);
    });
  }

  // удалили приоритет
  deletePriority(priority: Priority): void {
    this.settingsChanged = true; // в настройках произошли изменения
    // сначала обновить в БД
    this.priorityService.delete(priority.id).subscribe(() => {
        // т.к. данные простые и без сортировки - то можно просто удалить объект в локальном массиве,
        // а не запрашивать заново из БД
        this.priorities.splice(this.getPriorityIndex(priority), 1);
      }
    );
  }

  // обновили приоритет
  updatePriority(priority: Priority): void {
    this.settingsChanged = true; // в настройках произошли изменения
    // сначала обновить в БД
    this.priorityService.update(priority).subscribe(() => {
        // т.к. данные простые и без сортировки - то можно просто обновить объект в локальном массиве,
        // а не запрашивать заново из БД
        this.priorities[this.getPriorityIndex(priority)] = priority;
      }
    );
  }

  // находит индекс элемента (по id) в локальном массиве
  getPriorityIndex(priority: Priority): number {
    const tmpPriority = this.priorities.find(t => t.id === priority.id);
    return this.priorities.indexOf(tmpPriority);
  }
}
