import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { Day, Week } from "app/common/date-picker.model";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @HostBinding('class') @Input() theme: string;

  private options: any = {
    selectMultiple: false,
    animate: true,
    range: true
  }

  public date: Date = new Date();
  private year = this.date.getFullYear();
  private month = this.date.getMonth();
  public weeks: Week[] = null;
  private days: Day[] = null;
  private day: Day = null;
  private selectedDates: Date[] = [];
  get weekDays() {
    const array = []
    for (var index = 0; index < 7; index++) {
      let weekday = this.date.toLocaleDateString('de-DE', { weekday: 'long'});
      array.push(weekday); 
    }
    console.log(array);
    
    return array;
  }

  constructor() { }

  ngOnInit() {
    this.createCalendarArray();
  }

  createDayArray(year = this.year, month = this.month): Day[] {
    let days = [];
    const daysInMonth = this.getDaysInMonth(year,month);

    for (var index = 0; index < daysInMonth; index++) {
      const dayNumber = index + 1;
      const date = new Date(year,month, dayNumber);
      var day = {
        date,
        dayNumber,
        isToday: this.isToday(date),
        isSelected: this.isSelected(date)
      }
      days.push(day);
    };

    return days;
  }

  createNextDayArray(): Day[] {
    const monthLength =  this.getDaysInMonth(this.year, this.month);
    const endOfTheMonth = new Date(this.year, this.month, monthLength).getDay();
    const nextDays = this.createDayArray(this.year,(this.month - 1));
    return nextDays.slice(0, 7 - endOfTheMonth);    
  }

  createPreviousDayArray(): Day[] {
    const startOfTheMonth = new Date(this.year, this.month, 0).getDay();
    const previousDays = this.createDayArray(this.year,(this.month - 1))
    return previousDays.slice(previousDays.length - startOfTheMonth, previousDays.length);
  }

  createWeekArray(dayArray: Day[]): Week[] {
    const size = 7;
    const weeks = [];
    while (dayArray.length) {
      weeks.push({
        days: dayArray.splice(0, size)
      });
    }
    return weeks;
  }

  getMergedDayArrays(): Day[] {
    return [...this.createPreviousDayArray(), ...this.createDayArray(),...this.createNextDayArray()]
  }

  createCalendarArray(){
    this.date = new Date(this.year, this.month);  
    const dayArray = this.getMergedDayArrays();
    this.weeks = this.createWeekArray(dayArray);    
  }

  updateValue(date: Date) {
    if(!this.isSelected(date)){
      if(!this.options.selectMultiple) {
        this.toggleDate(date);  
      } else {
        this.selectDate(date);
      }
    } else {
      this.deselectDate(date);
    }
  }

  toggleDate(date: Date) {
    this.selectedDates = [];
    this.selectDate(date);
  }

  selectDate(date: Date) { 
    this.selectedDates.push(date);   
    this.createCalendarArray();
  }

  deselectDate(date: Date) { 
    this.selectedDates = this.selectedDates.filter((selectedDate)=>{
      return selectedDate.toDateString() !== date.toDateString();
    });   

    this.createCalendarArray();
  }

  goToNextMonth() {
    if(this.month === 11) {
      this.month = 0;
      this.goToNextYear();
    } else {
      this.month += 1;
    }
  
    this.createCalendarArray();
  }

  goToPreviousMonth() {
    if(this.month === 0){
      this.month = 11;
      this.goToPreviousYear();
    } else {
      this.month -= 1;
    }    
    
    this.createCalendarArray();
  }

  goToPreviousYear() {
    this.year -= 1;
  }

  goToNextYear() {
    this.year += 1;
  }

  isToday(date: Date): boolean {
   return date.toDateString() == this.date.toDateString()
  }

  isSelected(date: Date): boolean {
    if(!this.selectedDates) {
      return false;
    }
      
    return (this.selectedDates
    .map(date => date.toDateString())
    .indexOf(date.toDateString()) !== -1);
  }

  getDaysInMonth(year: number, month: number): number {
      return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  isLeapYear(year: number): boolean {
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

}
