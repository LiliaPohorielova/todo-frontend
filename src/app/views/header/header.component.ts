import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "../../dialog/settings-dialog/settings-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  categoryName: string;

  @Input()
  isShow: boolean;

  @Output()
  toggleStatistic = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void { }

  showSettings(){
    const dialogRef = this.dialog.open(SettingsDialogComponent,
      {
        autoFocus: false,
        width: '500px'
      });
  }

  onToggleStatistic() {
    this.toggleStatistic.emit(!this.isShow);
  }
}
