import {Observable} from "rxjs";

export interface BaseDAO<T> {
  /*   JAVA
  create(T: T): T;
  update(T: T): T;
  delete(id: number): T;
  findById(id: number): T;
  findAll(): T[];*/

  // Angular With Reactive Programming
  create(T: T): Observable<T>;
  update(T: T): Observable<T>;
  delete(id: number): Observable<T>;
  findById(id: number): Observable<T>;
  findAll(): Observable<T[]>;
}
