import {BaseModel} from "./BaseModel";

export class Category extends BaseModel {
  title: string;
  completedCount: number;
  uncompletedCount: number;

  constructor(id: number, title: string, completedCount?: number, uncompletedCount?: number) {
    super(id);
    this.title = title;
    this.completedCount = completedCount;
    this.uncompletedCount = uncompletedCount;
  }
}
