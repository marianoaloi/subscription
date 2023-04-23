import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { delay, map, Observable, retry } from 'rxjs';
import { Cost } from './entity/cost';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(private http: HttpClient) { }

  getRGs(subs: string): Observable<any> {
    return this.http.get(`https://management.azure.com/subscriptions/${subs}/resourcegroups?api-version=2021-04-01`)
      .pipe(
        map((rgresult: any) => rgresult.value
        ))
  }

  getCost(subs: string): Observable<Cost[]> {


    const url = `https://management.azure.com/subscriptions/${subs}/providers/Microsoft.CostManagement/query?api-version=2022-10-01`;

    const randomInteger= (min: number, max: number)=> {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const callQuery = (url: string) => {
     
      return this.getCostQuery(url).pipe(
        map(
          (m: any) => {
            let colCostResult = m.properties.rows
              .map((x: any[]) => {
                return { value: x[0], cobranca: x[1], rg: x[2], componente: x[3], moeda: x[4] } as Cost
              }
              )
            if (m.properties.nextLink) {
               // simulate a 500ms to 1.5s network latency from the server
              delay(randomInteger(500, 1500))
              callQuery(m.properties.nextLink).subscribe(
                extraCost=>colCostResult=colCostResult.concat(extraCost)
              )
              
            }
            return colCostResult;
          }
        )
      );
    }



    return callQuery(url);
  }


  getCostQuery(url: string): Observable<any> {

    const end = moment()
    end.add(1, 'day')
    const begin = moment().add(-4, 'month')
    begin.date(1)
    begin.hour(0)
    begin.second(0)
    begin.minute(0)

    const body = {
      "type": "ActualCost",
      "timeframe": "Custom"
      , "timePeriod": { "from": begin.toISOString(), "to": end.toISOString() }
      ,
      "dataset": {
        "granularity": "Monthly",
        "aggregation": {
          "totalCost": {
            "name": "Cost",
            "function": "Sum"
          }
        },
        "grouping": [
          {
            "type": "Dimension",
            "name": "ResourceGroup"
          }
          ,

          {
            "type": "Dimension",
            "name": "ServiceName"
          }
        ]
      }
    }

    return this.http.post(url, body).pipe(
      retry(2) // retry 2 times on error
    )

  }
}
