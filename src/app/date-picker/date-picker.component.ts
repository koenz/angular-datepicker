import { Component, OnInit } from '@angular/core';
import { Day } from "app/common/date-picker.model";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  private date: Date = new Date();
  private year = this.date.getFullYear();
  private month = this.date.getMonth();
  private daysInMonth: number = this.getDaysInMonth(this.year,this.month);
  public days: Day[] = this.createDayArray();
  private day: Day = null;
  private selectedDates: Date[] = [];

  constructor() { }

  ngOnInit() {
    this.createDayArray();
  }

  createDayArray(): Day[] {
    let days = [];

    for (var index = 0; index < this.daysInMonth; index++) {
      const dayNumber = index + 1;
      const date = new Date(this.year,this.month, dayNumber);
      var day = {
        date,
        dayNumber,
        isToday: this.isToday(date),
        isSelected: this.isSelected(date)
      }
      days.push(day);
    }
    console.log(days);
    
    return days;
  }

  updateValue(date: Date) {
    if(this.isSelected(date)){
      this.selectDate(date);
    } else {
      this.deselectDate(date);
    }
  }

  selectDate(date: Date) { 
    this.selectedDates.push(date);   
    this.days = this.createDayArray();
  }

  deselectDate(date: Date) { 
    this.selectedDates = this.selectedDates.filter((selectedDate)=>{
      selectedDate.toDateString() === date.toDateString();
    });   
    this.days = this.createDayArray();
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

  getDaysInMonth(year: number, month: number) {
      return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  isLeapYear(year: number): boolean {
      // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }

}
