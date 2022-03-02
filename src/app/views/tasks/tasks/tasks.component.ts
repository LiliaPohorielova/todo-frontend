import { Component, OnInit } from '@angular/core';
import {DataHandlerService} from "../../../service/data-handler.service";
import {Task} from "../../../model/Task";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  //поля таблицы (названия колонок)
  public displayedColumns: string[] = ['color','id','title','date','priority','category'];
  // @ts-ignore
  public dataSource: MatTableDataSource<Task>; //контейнер - источник данных для таблицы

  // @ts-ignore
  tasks: Task[];

  constructor(private dataHandler: DataHandlerService) {  }

  ngOnInit() {
    // @ts-ignore
    this.dataHandler.taskSubject.subscribe(tasks => this.tasks = tasks);
    this.dataSource = new MatTableDataSource();
    this.refreshTable();
  }

  toggleTaskCompleted(task: Task) {
    task.completed = !task.completed;
  }

  //в зависимости от статуса - вернуть цвет
  public getPriorityColor(task: Task) {
    if (task.completed) {
      return "#F8F9FA";
    }
    if (task.priority && task.priority.color) {
      return task.priority.color;
    }
    return '#fff';
  }

  //показывает задачи учитывая поиск, фильтр, категории
  private refreshTable() {
    this.dataSource.data = this.tasks; //обновить источник данных для таблицы
  }
}
