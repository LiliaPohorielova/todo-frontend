import {Observable} from "rxjs";
import {Statistic} from "../../../model/Statistic";

export interface StatisticDAO {

  getStatistic(): Observable<Statistic>;

}
