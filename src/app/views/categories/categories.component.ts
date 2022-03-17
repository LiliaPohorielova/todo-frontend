import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {OperationType} from "../../dialog/OperationType";
import {DeviceDetectorService} from "ngx-device-detector";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input()
  categories: Category[];

  @Input()
  selectedCategory: Category;

  @Input('categoryMap')
  set setCategoryMap(categoryMap: Map<Category, number>) {
    this.selectedCategoryMap = categoryMap;
  }

  // кол-во невыполненных задач всего
  @Input()
  uncompletedTotal: number;

  // Выбрали категорию на сайте - узнаем какую именно
  // EventEmitter - произошло какое-то событие Event
  // selectCategory - название такое же как в HTML
  @Output()
  selectCategory = new EventEmitter<Category>();

  @Output()
  searchCategory = new EventEmitter<string>();

  @Output()
  addCategory = new EventEmitter<string>();

  @Output()
  updateCategory = new EventEmitter<Category>();

  @Output()
  deleteCategory = new EventEmitter<Category>();

  indexMouseMove: number;
  searchCategoryTitle: string;
  selectedCategoryMap: Map<Category, number>;
  isMobile: boolean;
  isTablet: boolean;

  //Dependency Injection With Constructor
  constructor(
    private dataHandler: DataHandlerService, // Доступ к данным
    private dialog: MatDialog, // Работа с диалоговым окном
    private deviceDetector: DeviceDetectorService
  ) {
    this.isMobile = deviceDetector.isMobile();
    this.isTablet = deviceDetector.isTablet();
  }

  //Метод вызывается после создания данного Компонента;
  ngOnInit() {
    //this.dataHandler.findAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category): void {
    // Если выбрали ту же самую категорию, то выходим
    // Ничего не меняем, ибо незачем лезть в базу лишний раз
    if (this.selectedCategory === category) return;
    // Если категория новая - запоминаем её
    this.selectedCategory = category;
    this.selectCategory.emit(this.selectedCategory);
  }

  //Сохраняет индекс той категории, на которую наведена мышка
  showEditIcon(index: number) {
    this.indexMouseMove = index;
  }

  // Диалоговое окно для редактирования категории
  openEditDialog(category: Category) {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {data: [category.title, "Edit category", OperationType.EDIT], autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      // Обработка результата (то, что нам пришло после закрытия диалогового окна)

      if (result === 'delete') { // Удаляем
        this.deleteCategory.emit(category);
        return;
      }

      if (typeof (result) === 'string') { // Если есть результат - преобразовываем его в Task
        category.title = result as string;
        this.updateCategory.emit(category);
        return;
      }
    });
  }

  openDeleteDialog(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Action confirmation',
        message: 'Do you really want to delete the category:\n' +  category.title + '?'
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deleteCategory.emit(category); // Нажали удалить
    });
  }

  openAddCategoryDialog() {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {data: ['', "New category", OperationType.ADD], autoFocus: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.addCategory.emit(result as string);
    });
  }

  search() {
    if (this.searchCategoryTitle == null) return;
    this.searchCategory.emit(this.searchCategoryTitle);
  }
}
