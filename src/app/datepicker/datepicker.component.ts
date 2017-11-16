import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Day, Month, Week } from 'app/common/models/datepicker.model';
import { Options } from 'app/common/models/datepicker-options.model';

@Component({
	selector: 'app-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

	/* ==============================================
	 * Internal Properties
	 * ============================================== */

	public date: Date = new Date();
	public year: number = this.date.getFullYear();
	public month: number = this.date.getMonth();
	public today: Date = this.date;
	public months: Month[] = null;
	public weekdays: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	public currentMonthYear: Object[];
	public selectedRange = 'startDate';
	public startDate: Date = null;
	public endDate: Date = null;
	public isOpen = false;

	/* ==============================================
	 * Initial Options
	 * ============================================== */

	public options: Options;
	@Input('options') _options: Options;
	public defaults: Options = {
		theme: '', // Theme string is added to the host
		selectMultiple: false, // Select multiple dates
		closeOnSelect: true,  // Close datepicker when date(s) selected
		animate: false, // Animate the datepicker
		animationSpeed: 400, // Animation speed in ms
		easing: 'ease-in', // Easing type string
		numberOfMonths: 1, // Number of months shown
		slideBy: null, // Number of months shown
		hideRestDays: false, // Hide the rest days
		disableRestDays: true, // Disable the click on rest days
		hideNavigation: false, // Hide the navigation
		range: false, // Use range functionality
		min: null, // Disables dates until this date
		max: null, // Disables dates from this date
		year: this.year, // Initial year that is displayed
		month: this.month, // Initial month that is displayed
		firstMonthRight: false // Show the first month on the right (only with multiple months)
	};

	/* ==============================================
	 * External Properties
	 * ============================================== */

	/**
	 * Set the the language manualy. A string with a BCP 47 language tag
	 * @example nl-NL
	 */
	@Input() public language: string = navigator.language;

	/**
	 * Minimal Date: If set the dates before it will be disabled
	 */
	private _minDate = null;
	@Input() set minDate(value: Date) {
		this._minDate = new Date(value);
	}

	get minDate(): Date {
		return this._minDate;
	}

	/**
	 * Maximal Date: If set the dates after it will be disabled
	 */
	private _maxDate = null;
	@Input() set maxDate(value: Date) {
		this._maxDate = new Date(value);
	}

	get maxDate(): Date {
		return this._maxDate;
	}

	/**
	 * Selected Dates: handles the selected dates array. Can be set both internally and externally
	 */
	_selectedDates: Date[] = [];
	@Output() selectedDatesChange = new EventEmitter();

	@Input()
	set selectedDates(value: Date[]) {
		this._selectedDates = value;

		if (this.options.range !== undefined && this.options.range) {
			this.resetRange();
		}

		this.selectedDatesChange.emit(this._selectedDates);
	}

	get selectedDates(): Date[] {
		return this._selectedDates;
	}

	/* ==============================================
	 * Bindings and Children
	 * ============================================== */

	@ViewChild('calendarContainer') public calendarContainer: ElementRef;
	@ViewChild('calendarTopContainer') public calendarTopContainer: ElementRef;
	@HostBinding('class') @Input() theme: string;

	/* ==============================================
	 * Static Methods
	 * ============================================== */

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

	/**
	 * Get the formatted weekdays
	 *
	 * @param language
	 * @param format
	 * @param start
	 * @return {string[]}
	 */
	static getWeekDays(language: string, format: string, start: string): string[] {
		const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'faturday', 'sunday'];

		const index = days.indexOf(start.toLowerCase());
		if (index < 0) {
			throw new Error('Invalid week day start :' + start);
		}

		const weekdays = [];
		for (let day = 5; day <= 11; day++) {
			weekdays.push(
				new Date(1970, 1 - 1, day + index).toLocaleString(language, { weekday: format })
			);
		}

		return weekdays;
	}

	constructor() {
		this.options = Object.assign(this.defaults, this._options);
	}

	ngOnInit() {
		this.options = Object.assign(this.defaults, this._options);
		this.month = this.options.month;
		this.year = this.options.year;

		this.currentMonthYear = [{'month': this.month, 'year': this.year}];
		this.months = this.createCalendarArray(this.year, this.month);
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
				isFirst: dayNumber === 1,
				isLast: dayNumber === daysInMonth,
				isToday: this.isToday(date),
				isSelected: this.isSelected(date),
				isRest: isRestDays,
				isHidden: isRestDays && (this.options.animate || this.options.hideRestDays),
				isDisabled: this._minDate && this._maxDate && this.isDisabled(date) || isRestDays && this.options.disableRestDays,
				isInRange: this.isInRange(date) || (this.isStartDate(date) || this.isEndDate(date)) && this.startDate && this.endDate,
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
		const previousDays = this.createDayArray(this.getYearOfPreviousMonth(year, month), this.getPreviousMonth(month), true);
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
		];
	}

	/**
	 * Create the calendar array from the week arrays
	 * @param year
	 * @param month
	 */
	createCalendarArray(year: number, month: number): [{ weeks: Week[] }] {
		const dayArray = this.getMergedDayArrays(year, month);
		const weeks = DatepickerComponent.createWeekArray(dayArray);
		return [{weeks: weeks}];
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
		if (this.isSelected(date)) {
			this.deselectDate(date);
		} else if (this.isEarlier(date, this.startDate)) {
			if (this.startDate) {
				this.toggleDate(date, this.startDate, true);
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
				this.toggleDate(date, this.startDate, true);
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
	 * Reset the range if the selected dates change externally
	 */
	resetRange(): void {
		if (this._selectedDates.length === 1) {
			this.startDate = this._selectedDates[0];
			this.endDate = null;
		} else if (this._selectedDates.length === 0) {
			this.startDate = null;
			this.endDate = null;
		}
	}

	/**
	 * Toggle a date. One in, on out.
	 *
	 * @param date - Date to be toggled on
	 * @param toggleDate - Optional set specific date to toggle off
	 * @param unshift - Optional set to unshift in the selectedDates array. is passed to selectDate method
	 */
	toggleDate(date: Date, toggleDate?: Date, unshift?: boolean): void {
		if (!toggleDate) {
			this.selectedDates = [date];
		} else if (unshift) {
			this._selectedDates.unshift(date);
			this.selectedDates = this._selectedDates.filter((selectedDate) => {
				return selectedDate.toDateString() !== toggleDate.toDateString();
			});
		} else {
			this._selectedDates.push(date);
			this.selectedDates = this._selectedDates.filter((selectedDate) => {
				return selectedDate.toDateString() !== toggleDate.toDateString();
			});
		}
	}

	/**
	 * Select a date
	 *
	 * @param date
	 * @param unshift - Optional set to unshift instead of push the date in the selectedDates array
	 */
	selectDate(date: Date, unshift?: boolean): void {
		if (unshift) {
			this.selectedDates.unshift(date);
		} else {
			this.selectedDates.push(date);
		}
	}

	/**
	 * Deselect a date
	 *
	 * @param date
	 */
	deselectDate(date: Date): void {
		this.selectedDates = this._selectedDates.filter((selectedDate) => {
			return selectedDate.toDateString() !== date.toDateString();
		});
	}

	/**
	 * Go to the next month
	 */
	goToNextMonth(): void {
		this.month = this.getNextMonth(this.month);
		this.year = this.getYearOfNextMonth(this.year, this.month);
		this.currentMonthYear = [{'month': this.month, 'year': this.year}];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Go to the previous month
	 */
	goToPreviousMonth(): void {
		this.month = this.getPreviousMonth(this.month);
		this.year = this.getYearOfPreviousMonth(this.year, this.month);
		this.currentMonthYear = [{'month': this.month, 'year': this.year}];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Go to a specific month
	 */
	goToMonth(date: Date): void {
		this.currentMonthYear = [{'month': date.getMonth(), 'year': date.getFullYear()}];
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

	// TODO: maybe output the startDate and Endate or just of internal use
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
		return date > compareDate;
	}

	isEarlier(date: Date, compareDate: Date): boolean {
		return date < compareDate;
	}

	isLaterThenSelected(date: Date): boolean {
		return;
	}

	isSelected(dateToCheck: Date): boolean {
		return (this._selectedDates
			.map(date => date.toDateString())
			.indexOf(dateToCheck.toDateString()) !== -1);
	}

	isDisabled(date: Date): boolean {
		return !(date < this.maxDate && date > this.minDate);
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
