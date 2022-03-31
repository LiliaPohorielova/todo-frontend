import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {EditPriorityDialogComponent} from "../../dialog/edit-priority-dialog/edit-priority-dialog.component";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {DialogAction} from "../../object/DialogResult";

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

  ngOnInit(): void {  }

  // диалоговое окно для добавления
  openAddDialog(): void {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent, {
      data: [new Priority(null, '', PrioritiesComponent.defaultColor), 'Add priority'],
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) { // если просто закрыли окно, ничего не нажав
        return;
      }
      if (result.action === DialogAction.SAVE) {
        const newPriority = result.obj as Priority;
        this.addPriority.emit(newPriority);
      }
    });
  }

  // Диалоговое окно для редактирования приоритетов
  openEditDialog(priority: Priority) {
    const dialogRef = this.dialog.open(EditPriorityDialogComponent, {
      // передаем копию объекта, чтобы все изменения не касались оригинала (чтобы их можно было отменить)
      data: [new Priority(priority.id, priority.title, priority.color), 'Edit priority']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) { // если просто закрыли окно, ничего не нажав
        return;
      }
      if (result.action === DialogAction.DELETE) {
        this.deletePriority.emit(priority);
        return;
      }
      if (result.action === DialogAction.SAVE) {
        priority = result.obj as Priority; // получить отредактированный объект
        this.updatePriority.emit(priority);
        return;
      }
    });
  }

  openDeleteDialog(priority: Priority) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Action confirmation',
        message: 'Do you really want to delete the priority:\n' +  priority.title + '?'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result)) { // если просто закрыли окно, ничего не нажав
        return;
      }
      if (result.action === DialogAction.OK) {
        this.deletePriority.emit(priority);
      }
    });
  }
}
