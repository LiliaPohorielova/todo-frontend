import {Priority} from "./Priority";
import {Category} from "./Category";
import {BaseModel} from "./BaseModel";

export class Task extends BaseModel {
  title: string;
  completed: boolean;
  priority?: Priority;
  category?: Category;
  date?: Date;

  constructor(id: number, title: string, completed: boolean, priority?: Priority, category?: Category, date?: Date) {
    super(id);
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.category = category;
    this.date = date;
  }
}
