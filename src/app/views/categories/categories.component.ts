import {Component, OnInit} from '@angular/core';
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";
import {TestData} from "../../data/TestData";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  // @ts-ignore
  categories: Category[];
  // @ts-ignore
  selectedCategory: Category;

  //Dependency Injection With Constructor
  constructor(private dataHandler: DataHandlerService) {  }

  //Метод вызывается после создания данного Компонента;
  ngOnInit() {
    // @ts-ignore
    this.dataHandler.categorySubject.subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category) {
    this.selectedCategory = category;
    this.dataHandler.fillTasksByCategories(category);
  }
}
