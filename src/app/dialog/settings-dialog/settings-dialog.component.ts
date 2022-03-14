import { Component, OnInit } from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialogRef} from "@angular/material/dialog";
import {DataHandlerService} from "../../service/data-handler.service";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})
export class SettingsDialogComponent implements OnInit {

  priorities: Priority[];

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private dataHandler: DataHandlerService
  ) { }

  ngOnInit(): void {
    //получаем доступ к данным без посредников, чтобы изменения отображались сразу
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  onClose() {
    this.dialogRef.close(false);
  }

  // добавили приоритет
  onAddPriority(priority: Priority): void {
    this.dataHandler.addPriority(priority).subscribe();
  }

  // удалили приоритет
  onDeletePriority(priority: Priority): void {
    this.dataHandler.deletePriority(priority.id).subscribe();
  }

  // обновили приоритет
  onUpdatePriority(priority: Priority): void {
    this.dataHandler.updatePriority(priority).subscribe();
  }
}
