import {BaseModel} from "./BaseModel";

export class Statistic extends BaseModel {
  completedTotal: number;
  uncompletedTotal: number;

  constructor(id: number, completedTotal: number, uncompletedTotal: number) {
    super(id);
    this.completedTotal = completedTotal;
    this.uncompletedTotal = uncompletedTotal;
  }
}
