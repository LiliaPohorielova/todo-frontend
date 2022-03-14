import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html',
  styleUrls: ['./statistic-card.component.css']
})
export class StatisticCardComponent implements OnInit {

  @Input()
  completed = false;

  @Input()
  iconName: string;

  @Input()
  count1: any;

  @Input()
  countTotal: any;

  @Input()
  title: string;

  constructor() { }

  ngOnInit(): void { }
}
