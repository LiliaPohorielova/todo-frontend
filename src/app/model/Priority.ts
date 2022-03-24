import {BaseModel} from "./BaseModel";

export class Priority extends BaseModel {
  title: string;
  color: string;

  constructor(id: number, title: string, color: string) {
    super(id);
    this.title = title;
    this.color = color;
  }
}
