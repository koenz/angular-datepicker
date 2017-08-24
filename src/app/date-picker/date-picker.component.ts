import { Component, OnInit, HostBinding, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Day, Week, Month } from "app/common/models/datepicker.model";
import { Observable } from "rxjs/Observable";
import { Options } from "app/common/models/datepicker-options.model";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, AfterViewInit {

  @Input() private options: Options = {
    theme: null,
    selectMultiple: false,
    showRestDays: true,
    closeOnSelect: true,
    animate: false,
    animateBy: 1,
    range: true,
    min: null,
    max: null
  }

  @ViewChild('calendarContainer') public calendarContainer: ElementRef;

  @HostBinding('class') @Input() theme: string;
  @HostBinding('class.is-animate') private animate: boolean = this.options.animate;

  public calendarWidth: number;
  public calendarHeight: number;
  public styleObject: object;

  this.selectedDate: Range = null

  public date: Date = new Date();
  public today: Date = this.date;
  private year: number = this.date.getFullYear();
  private month: number = this.date.getMonth();
  public months: Month[] = null;
  public weeks: Week[] = null;
  private days: Day[] = null;
  private day: Day = null;
  private selectedDates: Date[] = [];
  public weekdays: string[] = ['Mo','Tu','We','Th','Fr','Sa','Su'];

  ngOnInit() {
    this.months = this.createCalendarArray();
    if(this.options.range && this.options.selectMultiple){
      console.warn('Multiple does not work in combination with the range option');
    }
    if(this.options.range && this.options.showRestDays){
      console.warn('Showing rest days is not possible in combination with the range option');
    }
    if(this.options.animate && this.options.showRestDays){
      console.warn('Showing rest days is not possible in combination with the animate option');
    }
  }
  
  ngAfterViewInit() {
     setTimeout(() => {
      this.calendarHeight = this.calendarContainer.nativeElement.offsetHeight;
      this.calendarWidth = this.calendarContainer.nativeElement.offsetWidth;
      this.setStyleObject();
     });
  }

  setStyleObject(){
    this.styleObject = {
      'height.px': this.calendarHeight,
      'width.px': this.calendarWidth
    };
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
        isSelected: this.isSelected(date),
        isDisabled: this.isDisabled(date),
        inRange: this.inRange(date)
      }
      days.push(day);
    };

    return days;
  }

  getNextRestDays(): Day[] {
    const monthLength =  this.getDaysInMonth(this.year, this.month);
    const endOfTheMonth = new Date(this.year, this.month, monthLength).getDay();
    const nextDays = this.createDayArray(this.getYearOfNextMonth(),this.getNextMonth()).slice(0, 7 - endOfTheMonth);
    return nextDays.length > 6 ? [] : nextDays;
  }

  getPreviousRestDays(): Day[] {
    const startOfTheMonth = new Date(this.year, this.month, 0).getDay();   
    const previousDays = this.createDayArray(this.getYearOfPreviousMonth(),this.getPreviousMonth())
    return previousDays.slice(previousDays.length - startOfTheMonth, previousDays.length);
  }

  getMergedDayArrays(): Day[] {
    return [
      ...this.getPreviousRestDays(), 
      ...this.createDayArray(),
      ...this.getNextRestDays()
    ]
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

  createCalendarArray(year = this.year, month = this.month){
    this.date = new Date(year, month);  
    const dayArray = this.getMergedDayArrays();
    const weeks = this.createWeekArray(dayArray);
    return [{weeks:weeks}]
  }

  updateValue(date: Date) {
    if(!this.isSelected(date)){
      if(this.options.range){
        this.selectRange(date);
      } else if(this.options.selectMultiple) {
        this.selectDate(date);
      } else {
        this.toggleDate(date);  
      }
    } else {
      this.deselectDate(date);
    }
  }

  selectRange(date: Date){
    
  }

  toggleDate(date: Date) {
    this.selectedDates = [];
    this.selectDate(date);
  }

  selectDate(date: Date) { 
    this.selectedDates.push(date);
    this.months = this.createCalendarArray();
  }

  deselectDate(date: Date) { 
    this.selectedDates = this.selectedDates.filter((selectedDate)=>{
      return selectedDate.toDateString() !== date.toDateString();
    });   

    this.months = this.createCalendarArray();
  }

  goToNextMonth() {
    this.month = this.getNextMonth();
    this.year = this.getYearOfNextMonth();      

    if(this.options.animate){
      let array = []
      for (var index = 0; index < this.options.animateBy; index++) {
        array[index] = this.createCalendarArray();  
      }
      let previousMonths = [].concat.apply([], array);   
      this.months = this.months.concat(previousMonths)
    } else {
      this.months = this.createCalendarArray();
    }
  }

  goToPreviousMonth() {
    this.month = this.getPreviousMonth();
    this.year = this.getYearOfPreviousMonth(); 
    
    if(this.options.animate){
      let array = []
      for (var index = 0; index < this.options.animateBy; index++) {
        array[index] = this.createCalendarArray();  
      }
      let previousMonths = [].concat.apply([], array);   
      this.months = previousMonths.concat(this.months)
    } else {
      this.months = this.createCalendarArray();
    }
  }

  getYearOfNextMonth(): number{
    return this.month === 11 ? this.year + 1 : this.year;
  }

  getNextMonth(): number{
    return this.month === 11 ? 0 : this.month + 1;
  }

  getYearOfPreviousMonth(): number{
    return this.month === 0 ? this.year - 1 : this.year;
  }

  getPreviousMonth(): number{
    return this.month === 0 ? 11 : this.month - 1;
  }

  isToday(date: Date): boolean {
   return date.toDateString() == this.today.toDateString()
  }

  isSelected(date: Date): boolean {
    if(!this.selectedDates) {
      return false;
    }
      
    return (this.selectedDates
    .map(date => date.toDateString())
    .indexOf(date.toDateString()) !== -1);
  }

  isDisabled(date: Date): boolean {
    if(date < this.options.max && date > this.options.min) {
      return false;
    } else {
      return true;
    }
  }

  inRange(date: Date): boolean {
    return false;
  }

  getDaysInMonth(year: number, month: number): number {
      return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  isLeapYear(year: number): boolean {
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  

}
