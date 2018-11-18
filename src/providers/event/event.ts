import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../const/const';
import RRule from 'rrule';
import moment from 'moment-timezone';
import { Observable, BehaviorSubject } from 'rxjs';


/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {
  _urlEventType = api + '/type/1';
  private eventNonworking: BehaviorSubject<Date[]>;
  constructor(public http: HttpClient) {
    this.eventNonworking = new BehaviorSubject<Date[]>([]);
    this.dataStore = { event: [] }
    this.getEventbyTypeNonWorking()
  }
  private dataStore: {
    event: Date[]
  }
  get eventNonworkingDetail(): Observable<Date[]> {
    return this.eventNonworking.asObservable();
  }
  getEventbyTypeNonWorking() {
    let daysNonWorking: Date[] = []
    const url = this._urlEventType;
    this.http.get(url).subscribe(
      data => {
        var event: Object[]
        event = data['data']
        event.forEach(element => {
          
          if (element['is_recurring'] == 0) {
            var fromdate = new Date(element['from_date'].toString().replace(' ', 'T'));
            var todate = new Date(element['to_date'].toString().replace(' ', 'T'));     
                  
            for (let day = fromdate; day <= todate; day.setDate(day.getDate() + 1)) {
              daysNonWorking.push(new Date(day));       
            }
          } else {
            let pattern = JSON.parse(element['recurring_pattern'])
            let dtstart = "DTSTART:" + moment(element['from_date']).format('YYYYMMDDTHHmmss') + 'Z'
            let option = RRule.parseString(dtstart + '\n' + pattern['pattern'].slice(0, -1));
            option.freq = +pattern['freq']
            option.interval = pattern['interval']
            option.tzid = 'UTC+16'
            let rule = new RRule(option)
            rule.all().forEach(day => {
              daysNonWorking.push(new Date(day));
            })

          }
        })
        this.dataStore.event = daysNonWorking;
        this.eventNonworking.next(Object.assign({}, this.dataStore).event)
      }, error => {
        console.log(error)
      }
    )
  }

}
