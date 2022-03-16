import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "../../dialog/settings-dialog/settings-dialog.component";
import {IntroService} from "../../service/intro.service";

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

  @Output()
  toggleMenu = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private introService: IntroService
  ) { }

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

  showHelp() {
    this.introService.startIntroJs(false);
  }

  onToggleMenu() {
    this.toggleMenu.emit();
  }
}
