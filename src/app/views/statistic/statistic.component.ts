import {Component, Input, OnInit} from '@angular/core';
import {DashboardData} from '../../object/DashboardData';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})

// "presentational component": отображает полученные данные и отправляет какие-либо действия обработчику
// назначение - показать статистику
export class StatisticComponent implements OnInit {

  @Input()
  dash: DashboardData; // данные дэшбоарда

  @Input()
  showStat: boolean; // показать или скрыть статистику

  constructor() {
  }

  ngOnInit() {
  }

  // @ts-ignore
  getTotal(): number {
    if (this.dash) {
      return this.dash.completedTotal + this.dash.uncompletedTotal
    }
  }
  // @ts-ignore
  getCompletedCount() {
    if (this.dash) {
      return this.dash.completedTotal;
    }
  }
  // @ts-ignore
  getUncompletedCount() {
    if (this.dash) {
      return this.dash.uncompletedTotal;
    }
  }
  // @ts-ignore
  getCompletedPercent() {
    if (this.dash) {
      return this.dash.completedTotal ? (this.dash.completedTotal / this.getTotal()) : 0;
    }
  }
  // @ts-ignore
  getUncompletedPercent() {
    if (this.dash) {
      return this.dash.uncompletedTotal ? (this.dash.uncompletedTotal / this.getTotal()) : 0;
    }
  }
}
