import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from '../const/const';
import RRule from 'rrule';
import moment from 'moment-timezone';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable()
export class EventProvider {

  private eventNonworking: BehaviorSubject<Date[]>;
  private allEvents: BehaviorSubject<singularDate[]>;
  constructor(public http: HttpClient) {
    this.eventNonworking = new BehaviorSubject<Date[]>([]);
    this.allEvents = new BehaviorSubject<singularDate[]>([]);
    this.dataStore = { eventNonworking: [], allEvents: [] }
    this.getEventbyTypeNonWorking()
    this.getAllEvent();
  }
  private dataStore: {
    eventNonworking: Date[]
    allEvents: singularDate[]
  }
  get eventNonworkingDetail(): Observable<Date[]> {
    return this.eventNonworking.asObservable();
  }
  get allEvent(): Observable<singularDate[]> {
    return this.allEvents.asObservable();
  }
  getAllEvent() {
    let allEvents: singularDate[] = []
    const url = api + '/events';
    this.http.get(url).subscribe(data => {
      var event: Object[]
      event = data['data'];
      event.forEach(element => {
        let eventType = element['event_type_id'] === 1 ? 'T1: ' : element['event_type_id'] === 2 ? 'T2: ' : 'T3: ';
        if (element['is_recurring'] == 0) {
          var fromdate = new Date(element['from_date'].toString().replace(' ', 'T'));
          var todate = element['to_date'] !== null ? new Date(element['to_date'].toString().replace(' ', 'T')) : new Date(element['from_date'].toString().replace(' ', 'T'));
          for (let day = fromdate; day <= todate; day.setDate(day.getDate() + 1)) {
            let findEvent = allEvents.find(x => { return (moment(x.date).isSame(moment(day))) })
            if (findEvent === undefined) {
              allEvents.push({
                date: new Date(day),
                events: [eventType + element['event_title'].toString()]
              })
            } else {
              findEvent.events.push(eventType + element['event_title'].toString())
            }
          }
        } else {
          var pattern = JSON.parse(element['recurring_pattern'])
          var dtstart = "DTSTART:" + moment(element['from_date']).format('YYYYMMDDTHHmmss') + 'Z'
          var option = RRule.parseString(dtstart + '\n' + pattern['pattern'].slice(0, -1));
          option.freq = +pattern['freq']
          option.tzid = 'UTC+16'
          option.interval = +pattern['interval']
          var rule = new RRule(option)
          rule.all().forEach(day => {
            let findEvent = allEvents.find(x => { return (moment(x.date).isSame(moment(day))) })
            if (findEvent === undefined) {
              allEvents.push({
                date: new Date(day),
                events: [eventType + element['event_title'].toString()]
              })
            } else {
              findEvent.events.push(eventType + element['event_title'].toString())
            }
          })
        }
        this.dataStore.allEvents = allEvents;
        this.allEvents.next(Object.assign({}, this.dataStore).allEvents)
      })
    })
  }
  getEventbyTypeNonWorking() {
    let daysNonWorking: Date[] = []
    const url = api + '/type/1';
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
            option.interval = +pattern['interval']
            option.tzid = 'UTC+16'
            let rule = new RRule(option)
            rule.all().forEach(day => {
              daysNonWorking.push(new Date(day));
            })

          }
        })
        this.dataStore.eventNonworking = daysNonWorking;
        this.eventNonworking.next(Object.assign({}, this.dataStore).eventNonworking)
      }, error => {
        console.log(error)
      }
    )
  }

}
interface singularDate {
  date: Date;
  events: string[];
}