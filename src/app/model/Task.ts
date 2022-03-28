import {Priority} from "./Priority";
import {Category} from "./Category";
import {BaseModel} from "./BaseModel";

export class Task extends BaseModel {
  title: string;
  completed: number;
  priority?: Priority;
  category?: Category;
  date?: Date;

  constructor(id: number, title: string, completed: number, priority?: Priority, category?: Category, date?: Date) {
    super(id);
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.date = date;
  }
}
