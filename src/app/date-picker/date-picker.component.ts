import { Component, OnInit, HostBinding, Input, ViewChild, ElementRef, AfterViewInit, trigger, state, style, transition, animate } from '@angular/core';
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
    theme: '', // Theme string is added to the host
    selectMultiple: false, // Select multiple dates
    showRestDays: true, // Show the rest days from previous and next months
    closeOnSelect: true,  // Close datepicker when date(s) selected
    animate: true, // Animate the datepicker
    animationSpeed: 400, // Animation speed in ms
    easing: 'ease-in', // Easing type string
    numberOfMonths: 2, // Number of months shown
    hideRestDays: false, // hide the rest days
    disableRestDays: true, // disable the click on rest days
    range: true, // Use range funcionality
    min: null, // Disables dates until this date
    max: null // Disables dates from this date
  }

  /**
   * Set the the language manualy. A string with a BCP 47 language tag
   * @example nl-NL
   */
  @Input() public language: string = navigator.language;

  @ViewChild('calendarContainer') public calendarContainer: ElementRef;
  @ViewChild('calendarTopContainer') public calendarTopContainer: ElementRef;
  
  @HostBinding('style.width.px') public calendarWidth: number;
  @HostBinding('style.height.px') public calendarHeight: number;
  @HostBinding('class') @Input() theme: string;
  @HostBinding('class.is-animate') private animate: boolean = this.options.animate;
  
  public leftPosition: number = 0;
  public transition: string;
  public translateX: number;
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
  public numberOfMonths: Number[] = new Array(2);

  public selectedRange = 'startDate';
  public startDate: Date = null;
  public endDate: Date = null;

  ngOnInit() {
    if(this.options.numberOfMonths > 1){      
      this.months = this.getNextMonthArray();
    } else {
      this.months = this.createCalendarArray();
    }
    
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

  /**
   * Constructor - constucts the component with parameters
   * @param elementRef 
   */
  constructor(private elementRef: ElementRef) {}
  
  ngAfterViewInit() {    
    if(this.options.animate){    
      setTimeout(() => {
        this.calendarHeight = this.calendarContainer.nativeElement.offsetHeight + this.calendarTopContainer.nativeElement.offsetHeight
        this.calendarWidth = this.elementRef.nativeElement.offsetWidth * this.options.numberOfMonths;
      },1);
    }
  }

  /**
   * Get the calendar height
   * @return number;
   */
  setCalendarHeight(directionRight?: boolean) {
    const index = directionRight ? 0 : 1;
    setTimeout(() => {
      const calendar = this.elementRef.nativeElement.querySelectorAll('.datepicker__calendar')      
      this.calendarHeight = calendar[index].offsetHeight + this.calendarTopContainer.nativeElement.offsetHeight
    });
  }
  /**
   * Creates a day array
   * @param year 
   * @param month 
   * @param isRestDays 
   * @return Day[]
   */
  createDayArray(year = this.year, month = this.month, isRestDays?: boolean): Day[] {
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
        isRest: isRestDays,
        isHidden: isRestDays && (this.options.animate || this.options.hideRestDays),
        isDisabled: this.isDisabled(date) || isRestDays && this.options.disableRestDays,
        isInRange: this.isInRange(date),
        isStartDate: this.isStartDate(date),
        isEndDate: this.isEndDate(date)
      }
      days.push(day);
    };

    return days;
  }

  /**
   * Get the days from the next month and fills the last week of the current
   * @return Day[]
   */
  getNextRestDays(): Day[] {
    const monthLength =  this.getDaysInMonth(this.year, this.month);
    const endOfTheMonth = new Date(this.year, this.month, monthLength).getDay();
    const nextDays = this.createDayArray(this.getYearOfNextMonth(),this.getNextMonth(),true).slice(0, 7 - endOfTheMonth);
    return nextDays.length > 6 ? [] : nextDays;
  }

  /**
   * Get the days of the previous month and fills the first week of the current
   * @return Day[]
   */
  getPreviousRestDays(): Day[] {
    const startOfTheMonth = new Date(this.year, this.month, 0).getDay();    
    const previousDays = this.createDayArray(this.getYearOfPreviousMonth(),this.getPreviousMonth(), true);
    return previousDays.slice(previousDays.length - startOfTheMonth, previousDays.length);
  }

  /**
   * Merge all the day arrays together
   * @return Day[]
   */
  getMergedDayArrays(): Day[] {
    return [
      ...this.getPreviousRestDays(), 
      ...this.createDayArray(),
      ...this.getNextRestDays()
    ]
  }

  /**
   * Create a week array from the merged day arrays
   * @param dayArray 
   * @return Week[]
   */
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

  /**
   * Create the calendar array from the week arrays
   * @param year - default this.year
   * @param month  - default this.month
   */
  createCalendarArray(year = this.year, month = this.month): [{weeks: Week[]}] {
    this.date = new Date(year, month);  
    const dayArray = this.getMergedDayArrays();
    const weeks = this.createWeekArray(dayArray);
    return [{weeks:weeks}]
  }

  /**
   * Get next month array, gets multiple months.
   * Used when the options animate is set or multiple months are visable 
   */
  getNextMonthArray(): Month[] {
    const currentMonth = this.createCalendarArray();
    let array = [];
    let times = this.options.numberOfMonths > 1 ? this.options.numberOfMonths - 1 : 1;
    if(this.options.animate){
      times = times * 2 + 1;
    }
    for (var index = 0; index < times; index++) {
      this.month = this.getNextMonth();
      this.year = this.getYearOfNextMonth();
      array[index] = this.createCalendarArray();
      console.log(array[index]);
      
    }
    
    let nextMonths = [].concat.apply([], array);
    this.transition = 'transform 0ms ease-in';
    this.translateX = 0;
    this.leftPosition = 0;
    const months = currentMonth.concat(nextMonths)
    console.log(months);
    
    return months;
  }

  /**
   * Update value is being triggered
   * @param date 
   */
  updateValue(date: Date): void {
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

    if(this.options.animate){
      this.transition = 'all 0ms ease-in';
      this.translateX = 0;
      this.leftPosition = 0;
    }
    
    this.months = this.createCalendarArray();
  }

  /**
   * Select range method - contains the logic to select the start- and endrange
   * @param date 
   */
  selectRange(date: Date): void {
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
    if(this.options.animate){
      if(this.isAnimating){
        return;
      }

      this.months = this.getNextMonthArray();
      this.slideLeft();

    } else {

      this.month = this.getNextMonth();
      this.year = this.getYearOfNextMonth();
      this.months = this.createCalendarArray();

    }
  }

  goToPreviousMonth(): void {    
    if(this.options.animate){
      if(this.isAnimating){
        return;
      }

      const currentMonth = this.createCalendarArray();
      let array = [];

      for (var index = 0; index < (this.options.numberOfMonths); index++) {
        this.month = this.getPreviousMonth();
        this.year = this.getYearOfPreviousMonth();
        array[index] = this.createCalendarArray();
      }
      
      let previousMonths = [].concat.apply([], array);
      
      this.transition = 'all 0ms ease-in';
      this.translateX = 0;
      this.leftPosition = -100;
      this.months = previousMonths.concat(currentMonth);  

      this.slideRight();
    } else {
      this.month = this.getPreviousMonth();
      this.year = this.getYearOfPreviousMonth(); 
      this.months = this.createCalendarArray();
    }
  }

  slideRight(): void {
    this.setCalendarHeight(true);
    this.setIsAnimating();
    setTimeout(()=>{
      this.transition = 'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
      this.translateX = 50;
    }, 1);

  }

  slideLeft(): void {
    this.setCalendarHeight();
    this.setIsAnimating();
    setTimeout(()=>{
      this.transition = 'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
      this.translateX = -50;
    }, 100);
  }

  setIsAnimating(): void {
    this.isAnimating = true;
    setTimeout(()=>{
      this.isAnimating = false;
    }, this.options.animationSpeed);
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

  getYearOfNextMonth(month = this.month, year = this.year): number {
    return month === 11 ? year + 1 : year;
  }

  getNextMonth(month = this.month, year = this.year): number {
    return month === 11 ? 0 : month + 1;
  }

  getYearOfPreviousMonth(month = this.month, year = this.year): number {
    return month === 0 ? year - 1 : year;
  }

  getPreviousMonth(month = this.month, year = this.year): number {
    return month === 0 ? 11 : month - 1;
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
