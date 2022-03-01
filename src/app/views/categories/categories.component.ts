import {Component, OnInit} from '@angular/core';
import {DataHandlerService} from "../../service/data-handler.service";
import {Category} from "../../model/Category";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  // @ts-ignore
  categories: Category[]

  //Dependency Injection With Constructor
  constructor(private dataHandler: DataHandlerService) {
  }

  //Метод вызывается после создания данного Компонента;
  ngOnInit() {
    this.categories = this.dataHandler.getCategories();
  }
}
