import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  @Input()
  totalTasksInCategory: number;

  @Input()
  completeTasksInCategory: number;

  @Input()
  uncompletedTasksInCategory: number;

  constructor() { }

  ngOnInit(): void { }
}
