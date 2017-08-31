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
    theme: '',
    selectMultiple: false,
    showRestDays: true,
    closeOnSelect: true,
    animate: true,
    numberOfMonths: 1,
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
  public isOpen = false;
  public isAnimating = false;

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

  public selectedRange = 'startDate';
  public startDate: Date = null;
  public endDate: Date = null;

  ngOnInit() {
    this.months = this.createCalendarArray();
    if(this.options.range && this.options.selectMultiple){
      console.warn('Multiple does not work in combination with the range option');
    }
    if(this.options.range && this.options.showRestDays){
      console.warn('Showing rest days is not compatible with the range option');
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
        isInRange: this.isInRange(date),
        isStartDate: this.isStartDate(date),
        isEndDate: this.isEndDate(date)
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
    if(this.options.range){
      this.selectRange(date);
    } else if(!this.isSelected(date)){
      if(this.options.selectMultiple) {
        this.selectDate(date);
      } else {
        this.toggleDate(date);
      }
    } else {
      this.deselectDate(date);
    }
    
    this.months = this.createCalendarArray();
    
  }

  selectRange(date: Date) {
    if(this.isEarlier(date, this.startDate)) {
      if(this.startDate){
        this.toggleDate(date, this.startDate);
      } else {
        this.selectDate(date);
      }
      this.startDate = date;
      this.selectEndDate();
    } else if(this.endDate && this.isLater(date, this.endDate)) {
      this.toggleDate(date, this.endDate);
      this.endDate = date;
      this.selectStartDate();
    } else if(this.selectedRange === 'startDate') {
      if(this.startDate){
        this.toggleDate(date,this.startDate);
      } else {
        this.selectDate(date);
      }
      this.startDate = date;
      this.selectEndDate();
    } else if(this.selectedRange === 'endDate') {
      if(this.endDate){
        this.toggleDate(date,this.endDate);
      } else {
        this.selectDate(date);
      }
      this.endDate = date;
      this.selectStartDate();
      if(this.options.closeOnSelect){
        this.close();
      }
    }
  }

  toggleDate(date: Date, toggleDate?: Date): void {
    if(!toggleDate){
      this.selectedDates = [];
    } else {    
      this.deselectDate(toggleDate);
    }
    this.selectDate(date);
  }

  selectDate(date: Date): void {
    this.selectedDates.push(date);
  }

  deselectDate(date: Date): void { 
    this.selectedDates = this.selectedDates.filter((selectedDate)=>{
      return selectedDate.toDateString() !== date.toDateString();
    });    
  }

  goToNextMonth(): void {
    this.month = this.getNextMonth();
    this.year = this.getYearOfNextMonth();      

    if(this.options.animate){
      let array = []
      for (var index = 0; index < this.options.numberOfMonths; index++) {
        array[index] = this.createCalendarArray();  
      }
      let previousMonths = [].concat.apply([], array);   
      this.months = this.months.concat(previousMonths)
    } else {
      this.months = this.createCalendarArray();
    }
  }

  goToPreviousMonth(): void {
    this.month = this.getPreviousMonth();
    this.year = this.getYearOfPreviousMonth(); 
    
    if(this.options.animate){
      let array = []
      for (var index = 0; index < this.options.numberOfMonths; index++) {
        array[index] = this.createCalendarArray();  
      }
      let previousMonths = [].concat.apply([], array);   
      this.months = previousMonths.concat(this.months)
    } else {
      this.months = this.createCalendarArray();
    }
  }

  close(): void {
    this.isOpen = false;
  }

  selectStartDate(): void {
    this.selectedRange = 'startDate';
  }

  selectEndDate(): void {
    this.selectedRange = 'endDate';
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

  isStartDate(date: Date): boolean { 
    return this.startDate && date.toDateString() === this.startDate.toDateString();
  }

  isEndDate(date: Date): boolean {
    return this.endDate && date.toDateString() === this.endDate.toDateString();
  }

  isToday(date: Date): boolean {
   return date.toDateString() == this.today.toDateString()
  }

  isLater(date: Date, compareDate: Date): boolean {
    return date > compareDate
  }

  isEarlier(date: Date, compareDate: Date): boolean {
    return date < compareDate
  }

  isLaterThenSelected(date: Date): boolean {
    return 
  }

  isSelected(date: Date): boolean {
    return (this.selectedDates
    .map(date => date.toDateString())
    .indexOf(date.toDateString()) !== -1);
  }

  isDisabled(date: Date): boolean {
    return (date < this.options.max && date > this.options.min);
  }

  isInRange(date: Date): boolean {
    return this.startDate && this.endDate && this.startDate < date && date < this.endDate;
  }

  getDaysInMonth(year: number, month: number): number {
      return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  }

  isLeapYear(year: number): boolean {
      return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  }
  

}
