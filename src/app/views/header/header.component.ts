import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SettingsDialogComponent} from "../../dialog/settings-dialog/settings-dialog.component";
import {IntroService} from "../../service/intro.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {DialogAction} from "../../object/DialogResult";
import {Priority} from "../../model/Priority";

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

  @Output()
  settingsChanged = new EventEmitter<Priority[]>();

  isMobile: boolean;

  constructor(
    private dialog: MatDialog,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void { }

  showSettings(){
    const dialogRef = this.dialog.open(SettingsDialogComponent,
      {
        autoFocus: false,
        width: '500px'
      });

    dialogRef.afterClosed().subscribe(result => {

      if (result && result.action === DialogAction.SETTINGS_CHANGE) {
        this.settingsChanged.emit(result.obj);
        return;
      }
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
