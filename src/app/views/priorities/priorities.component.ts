import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit {

  static defaultColor = '#fff';

  @Input()
  priorities: Priority[];

  @Output()
  deletePriority = new EventEmitter<Priority>();

  @Output()
  updatePriority = new EventEmitter<Priority>();

  @Output()
  addPriority = new EventEmitter<Priority>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
