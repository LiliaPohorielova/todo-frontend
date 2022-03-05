import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {TestData} from "../../data/TestData";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input()
  categories: Category[];

  // Выбрали категорию на сайте - узнаем какую именно
  // EventEmitter - произошло какое-то событие Event
  // selectCategory - название такое же как в HTML
  @Output()
  selectCategory = new EventEmitter<Category>();

  selectedCategory: Category;

  //Dependency Injection With Constructor
  constructor(private dataHandler: DataHandlerService) {  }

  //Метод вызывается после создания данного Компонента;
  ngOnInit() {
    //this.dataHandler.findAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category) {
    // Если выбрали ту же самую категорию, то выходим
    // Ничего не меняем, ибо незачем лезть в базу лишний раз
    if (this.selectedCategory === category) return;
    // Если категория новая - запоминаем её
    this.selectedCategory = category;
    this.selectCategory.emit(this.selectedCategory);
  }
}
