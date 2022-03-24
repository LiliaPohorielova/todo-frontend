export abstract class BaseModel {
  id: number;

  protected constructor(id: number) {
    this.id = id;
  }
}
