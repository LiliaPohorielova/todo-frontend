import {Priority} from "./Priority";
import {Category} from "./Category";
import {BaseModel} from "./BaseModel";

export class Task extends BaseModel {
  title: string;
  completed: number;
  priority: Priority;
  category: Category;
  date?: Date;

  oldCategory: Category;

  constructor(id: number, title: string, completed: number, priority?: Priority, category?: Category, oldCategory?: Category, date?: Date) {
    super(id);
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.oldCategory = oldCategory;
    this.date = date;
  }
}
