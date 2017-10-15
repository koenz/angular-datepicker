import { Component, OnInit, Input, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { Options } from 'app/common/models/datepicker-options.model';
import { DatepickerComponent } from 'app/datepicker/datepicker.component';
import { Month } from 'app/common/models/datepicker.model';
import { UtilitiesService } from 'app/common/services/utilities.service.';

@Component({
  selector: 'app-multipicker',
  templateUrl: './multipicker.component.html',
  styleUrls: ['./multipicker.component.scss']
})
export class MultipickerComponent extends DatepickerComponent {

  @Input() public options: Options;

  @ViewChild('calendarContainer') public calendarContainer: ElementRef;
  @HostBinding('style.width.px') public datepickerWidth: number;

  public calendarWidth = 100 / this.options.numberOfMonths

	/**
	 * Constructor - constucts the component with parameters
	 * @param elementRef
	 * @param utilities
	 */
  constructor(public elementRef: ElementRef, public utilities: UtilitiesService) {
    super();
  }

  ngOnInit() {
    this.months = this.getNextMonthArray(this.month, this.year, true);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.datepickerWidth = this.elementRef.nativeElement.offsetWidth * this.options.numberOfMonths;
    }, 1);
  }

  /**
  * Get next month array, gets multiple months. // REMOVE
  * Used when the options animate is set or multiple months are visable 
  * @return Month[]
  */
  getNextMonthArray(month: number, year: number, keepDate = false): Month[] {
    let array = [];
    let times = this.options.numberOfMonths;

    for (var index = 0; index < times; index++) {
      array[index] = { 'month': month, 'year': year };
      month = this.getNextMonth(month);
      year = this.getYearOfNextMonth(month, year);

      if (!keepDate && index === (this.options.numberOfMonths - 1)) {
        this.month = month;
        this.year = year;
      }
    }

    let monthArray = []
    array.forEach(e => {
      monthArray.push(this.createCalendarArray(e.year, e.month));
    });

    let nextMonths = [].concat.apply([], monthArray);
    this.currentMonthYear = array;

    return nextMonths;
  }
  /**
   * Gets an array of previous months. Used for animation and when more months are displayed // REMOVE
   * @param month 
   * @param year 
   * @param keepDate 
   */
  getPreviousMonthArray(month: number, year: number, keepDate = false): Month[] {
    let array = [];
    let times = this.options.numberOfMonths;

    if (this.options.animate) {
      times = times * 2;
    }

    for (var index = 0; index < times; index++) {

      month = this.getPreviousMonth(month);
      year = this.getYearOfPreviousMonth(month, year);

      array[index] = { 'month': month, 'year': year };

      if (!keepDate) {
        this.month = month;
        this.year = year;
      }
    }

    let previousArray = [];
    array.reverse().forEach(e => {
      previousArray.push(this.createCalendarArray(e.year, e.month));
    });

    let previousMonths = [].concat.apply([], previousArray);
    const months = previousMonths;
    this.currentMonthYear = array;


    return months;
  }

  /**
   * Update value is being triggered
   * @param date 
   */
  updateValue(date: Date): void {
    if (this.options.range) {
      this.selectRange(date);
    } else if (!this.isSelected(date)) {
      if (this.options.selectMultiple) {
        this.selectDate(date);
      } else {
        this.toggleDate(date);
      }
    } else {
      this.deselectDate(date);
    }

    this.months = this.getNextMonthArray(this.month, this.year, true);

  }

  /**
 * Go to the next month
 */
  goToNextMonth(): void {
    this.months = this.getNextMonthArray(this.month, this.year);
  }

  /**
   * Go to the previous month
   */
  goToPreviousMonth(): void {
    this.months = this.getPreviousMonthArray(this.month, this.year);
  }
}
