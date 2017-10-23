import {
	Component,
	OnInit,
	HostBinding,
	Input,
	ViewChild,
	ElementRef
} from '@angular/core';
import { Day, Week, Month } from 'app/common/models/datepicker.model';
import { Options } from 'app/common/models/datepicker-options.model';
import { UtilitiesService } from 'app/common/services/utilities.service.';


@Component({
	selector: 'app-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

	@Input() public options: Options; //= {
	// 	theme: '', // Theme string is added to the host
	// 	selectMultiple: false, // Select multiple dates
	// 	showRestDays: true, // Show the rest days from previous and next months
	// 	closeOnSelect: true,  // Close datepicker when date(s) selected
	// 	animate: false, // Animate the datepicker
	// 	animationSpeed: 400, // Animation speed in ms
	// 	easing: 'ease-in', // Easing type string
	// 	numberOfMonths: 1, // Number of months shown
	// 	slideBy: null, // Number of months shown
	// 	hideRestDays: false, // hide the rest days
	// 	disableRestDays: true, // disable the click on rest days
	// 	range: false, // Use range functionality
	// 	min: null, // Disables dates until this date
	// 	max: null // Disables dates from this date
	//}

	/**
	 * Set the the language manualy. A string with a BCP 47 language tag
	 * @example nl-NL
	 */
	@Input() public language: string = navigator.language;

	@ViewChild('calendarContainer') public calendarContainer: ElementRef;
	@ViewChild('calendarTopContainer') public calendarTopContainer: ElementRef;

	@HostBinding('class') @Input() theme: string;

	public isOpen = false;
	public date: Date = new Date();
	public today: Date = this.date;
	public year: number = this.date.getFullYear();
	public month: number = this.date.getMonth();
	public months: Month[] = null;
	private days: Day[] = null;
	private selectedDates: Date[] = [];

	public weekdays: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	public numberOfMonths: Number[] = new Array(this.options.numberOfMonths);
	public currentMonthYear: Object[];

	public selectedRange = 'startDate';
	public startDate: Date = null;
	public endDate: Date = null;

	/**
	 * Create a week array from the merged day arrays
	 * 
	 * @param dayArray
	 * @return Week[]
	 */
	static createWeekArray(dayArray: Day[]): Week[] {
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
	 * Check if year is a leap year
	 * 
	 * @param year
	 * @return boolean
	 */
	static isLeapYear(year: number): boolean {
		return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	}

	ngOnInit() {
		this.currentMonthYear = [{ 'month': this.month, 'year': this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
		console.log(this.numberOfMonths);
		

		if (this.options.range && this.options.selectMultiple) {
			console.warn('Multiple does not work in combination with the range option');
		}
		if (this.options.range && this.options.showRestDays) {
			console.warn('Showing rest days is not compatible with the range option');
		}
		if (this.options.animate && this.options.showRestDays) {
			console.warn('Showing rest days is not possible in combination with the animate option');
		}
	}

	/**
	 * Creates a day array
	 * @param year
	 * @param month
	 * @param isRestDays
	 * @return Day[]
	 */
	createDayArray(year: number, month: number, isRestDays?: boolean): Day[] {
		const days = [];
		const daysInMonth = this.getDaysInMonth(year, month);

		for (let index = 0; index < daysInMonth; index++) {
			const dayNumber = index + 1;
			const date = new Date(year, month, dayNumber);
			const day = {
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
			};
			days.push(day);
		}

		return days;
	}

	/**
	 * Get the days from the next month and fills the last week of the current
	 * @return Day[]
	 */
	getNextRestDays(year, month): Day[] {
		const monthLength = this.getDaysInMonth(year, month);
		const endOfTheMonth = new Date(year, month, monthLength).getDay();
		const nextDays = this.createDayArray(this.getYearOfNextMonth(year, month), this.getNextMonth(month), true).slice(0, 7 - endOfTheMonth);
		return nextDays.length > 6 ? [] : nextDays;
	}

	/**
	 * Get the days of the previous month and fills the first week of the current
	 * @return Day[]
	 */
	getPreviousRestDays(year, month): Day[] {
		const startOfTheMonth = new Date(year, month, 0).getDay();
		const previousDays = this.createDayArray(this.getYearOfPreviousMonth(year, month),this.getPreviousMonth(month), true);
		return previousDays.slice(previousDays.length - startOfTheMonth, previousDays.length);
	}

	/**
	 * Merge all the day arrays together
	 * @return Day[]
	 */
	getMergedDayArrays(year: number, month: number): Day[] {
		return [
			...this.getPreviousRestDays(year, month),
			...this.createDayArray(year, month),
			...this.getNextRestDays(year, month)
		]
	}

	/**
	 * Create the calendar array from the week arrays
	 * @param year
	 * @param month
	 */
	createCalendarArray(year: number, month: number): [{ weeks: Week[] }] {
		this.date = new Date(year, month);
		const dayArray = this.getMergedDayArrays(year, month);
		const weeks = DatepickerComponent.createWeekArray(dayArray);
		return [{ weeks: weeks }]
	}

	/**
	 * Update value is being triggered
	 * 
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

		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Select range method - contains the logic to select the start- and endrange
	 * 
	 * @param date
	 */
	selectRange(date: Date): void {
		if (this.isEarlier(date, this.startDate)) {
			if (this.startDate) {
				this.toggleDate(date, this.startDate);
			} else {
				this.selectDate(date);
			}
			this.startDate = date;
			this.selectEndDate();
		} else if (this.endDate && this.isLater(date, this.endDate)) {
			this.toggleDate(date, this.endDate);
			this.endDate = date;
			this.selectStartDate();
		} else if (this.selectedRange === 'startDate') {
			if (this.startDate) {
				this.toggleDate(date, this.startDate);
			} else {
				this.selectDate(date);
			}
			this.startDate = date;
			this.selectEndDate();
		} else if (this.selectedRange === 'endDate') {
			if (this.endDate) {
				this.toggleDate(date, this.endDate);
			} else {
				this.selectDate(date);
			}
			this.endDate = date;
			this.selectStartDate();
			if (this.options.closeOnSelect) {
				this.close();
			}
		}
	}

	/**
	 * Toggle a date. One in, on out.
	 * 
	 * @param date - Date to be toggled on
	 * @param toggleDate - Optional set specific date to toggle off
	 */
	toggleDate(date: Date, toggleDate?: Date): void {
		if (!toggleDate) {
			this.selectedDates = [];
		} else {
			this.deselectDate(toggleDate);
		}
		this.selectDate(date);
	}

	/**
	 * Select a date
	 * 
	 * @param date
	 */
	selectDate(date: Date): void {
		this.selectedDates.push(date);
	}

	/**
	 * Deselect a date
	 * 
	 * @param date
	 */
	deselectDate(date: Date): void {
		this.selectedDates = this.selectedDates.filter((selectedDate) => {
			return selectedDate.toDateString() !== date.toDateString();
		});
	}

	/**
	 * Go to the next month
	 */
	goToNextMonth(): void {
		this.month = this.getNextMonth(this.month);
		this.year = this.getYearOfNextMonth(this.year, this.month);
		this.currentMonthYear = [{ 'month': this.month, 'year': this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Go to the previous month
	 */
	goToPreviousMonth(): void {
		this.month = this.getPreviousMonth(this.month);
		this.year = this.getYearOfPreviousMonth(this.year, this.month);
		this.currentMonthYear = [{ 'month': this.month, 'year': this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
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

	getYearOfNextMonth(year: number, month: number): number {
		return month === 11 ? year + 1 : year;
	}

	getNextMonth(month: number): number {
		return month === 11 ? 0 : month + 1;
	}

	getYearOfPreviousMonth(year: number, month: number): number {
		return month === 0 ? year - 1 : year;
	}

	getPreviousMonth(month: number): number {
		return month === 0 ? 11 : month - 1;
	}

	isStartDate(date: Date): boolean {
		return this.startDate && date.toDateString() === this.startDate.toDateString();
	}

	isEndDate(date: Date): boolean {
		return this.endDate && date.toDateString() === this.endDate.toDateString();
	}

	isToday(date: Date): boolean {
		return date.toDateString() === this.today.toDateString();
	}

	isLater(date: Date, compareDate: Date): boolean {
		return date > compareDate
	}

	isEarlier(date: Date, compareDate: Date): boolean {
		return date < compareDate
	}

	isLaterThenSelected(date: Date): boolean {
		return;
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
		return [31, DatepickerComponent.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	// TODO: maybe add clear undefined, not sure why though
	clearUndefined() {
	}
}
