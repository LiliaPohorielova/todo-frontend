import {Component, Input, OnInit} from '@angular/core';
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
  selectedCategory: Category;

  //Dependency Injection With Constructor
  constructor(private dataHandler: DataHandlerService) {  }

  //Метод вызывается после создания данного Компонента;
  ngOnInit() {
    //this.dataHandler.findAllCategories().subscribe(categories => this.categories = categories);
  }

  showTasksByCategory(category: Category) {
    this.selectedCategory = category;
    this.dataHandler.fillTasksByCategories(category);
  }
}
