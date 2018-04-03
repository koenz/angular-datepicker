import {
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { DefaultOptions } from './datepicker.options';
import { Month, Day, Week } from '../../models/datepicker.model';
import { Options } from '../../models/datepicker-options.model';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
	selector: 'aa-datepicker',
	templateUrl: './datepicker.component.html',
	styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
    /* ==============================================
	 * Internal Properties
	 * ============================================== */
	public date: Date = new Date();
	public year: number = null;
	public month: number = null;
	public today: Date = this.date;
	public months: Month[] = null;
	public weekdays: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	public currentMonthYear: Object[];
	public selectedRange = 'startDate';
	public startDate: Date = null;
	public endDate: Date = null;

    /* ==============================================
	 * Initial Options
	 * ============================================== */
	public _options: Options = DefaultOptions;
	@Input('options') set options(options){
		if (options === undefined || !options) {
			return;
		}

		this._options = {...this._options, ...options};

		if(options.currentDate !== undefined){
			this.date = this.options.currentDate;
		}

		this.goToDate(this.date);
	}
	get options(): Options {
		return this._options;
	}

    /* ==============================================
	 * External Properties
	 * ============================================== */

    /**
     * Set the the language manualy. A string with a BCP 47 language tag
     * @example nl-NL
     */
	_language = navigator.language;
	@Input()
	set language(value: string) {
		if (!value || value === undefined || !DatepickerComponent.isValidIsoCode(value)) {
			return;
		}

		this._language = value;

		this.weekdays = DatepickerComponent.getWeekDays(this._language, 'short', 'monday');
	}
	get language() {
		return this._language;
	}

    /**
     * Minimal Date: If set the dates before it will be disabled
     */
	public _minDate = null;
	@Input()
	set minDate(value: Date) {
		if (value === undefined || value === this._minDate) {
			return;
		}
		this._minDate = new Date(value);
		this.goToDate(this.date);
	}
	get minDate(): Date {
		return this._minDate;
	}

    /**
     * Maximal Date: If set the dates after it will be disabled
     */
	public _maxDate = null;
	@Input()
	set maxDate(value: Date) {
		if (value === undefined || value === this._minDate) {
			return;
		}
		this._maxDate = new Date(value);
		this.goToDate(this.date);
	}
	get maxDate(): Date {
		return this._maxDate;
	}

    /**
     * Selected Dates: handles the selected dates array. Can be set both internally and externally
     */
	private _selectedDates: Date[] = [];
	@Output() selectedDatesChange = new EventEmitter();
	@Input()
	set selectedDates(value: Date[]) {		
		const _value = Array.isArray(value) ? value : [value];
		if (!this.isValidDate(_value)) {
			return;
		}

		this._selectedDates = _value;

		if (this.options.range) {
			this.resetRange();
		}

		this.goToDate(this.date);

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
	@HostBinding('class') @Input() theme = '';
	@HostBinding('class.is-open') @Input() isOpen = true;
	@HostBinding('class.is-directive') asDirective = false;
	@HostBinding('class.is-animate') animate = false;
	@HostBinding('style.top.px') topPosition = null;
	@HostBinding('style.left.px') leftPosition = null;
	@HostBinding('style.bottom.px') bottomPosition = null;
	@HostBinding('style.right.px') rightPosition = null;

    /* ==============================================
	 * Static Methods
	 * ============================================== */

	static isValidIsoCode(isoCode: string): boolean {
		const pattern = new RegExp(/([a-z]{2})-([A-Z]{2})/);
		return pattern.test(isoCode);
	}

    /**
     * Create a week array from the merged day arrays
     *
     * @param dayArray
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
     */
	static isLeapYear(year: number): boolean {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

    /**
     * Get the formatted weekdays
     *
     * @param language
     * @param format
     * @param start
     */
	static getWeekDays(language: string, format: string, start: string): string[] {
		const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'faturday', 'sunday'];

		const index = days.indexOf(start.toLowerCase());
		if (index < 0) {
			throw new Error('Invalid week day start :' + start);
		}

		const weekdays = [];
		for (let day = 5; day <= 11; day++) {
			weekdays.push(new Date(1970, 1 - 1, day + index).toLocaleString(language, { weekday: format }));
		}

		return weekdays;
	}

	constructor(
		public utils: UtilitiesService,
		public element: ElementRef
	) { }


	ngOnInit() {
		if (!this.month && !this.year) {
			this.goToDate(this.options.currentDate);
		}
	}

    /**
     * Creates a day array
     *
     * @param year
     * @param month
     * @param isRestDays
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
				isHidden: isRestDays && (this.options.hideRestDays),
				isDisabled:
					((this.minDate || this.maxDate) && this.isDisabled(date)) ||
					(isRestDays && this.options.disableRestDays),
				isInRange:
					this.isInRange(date) ||
					((this.isStartDate(date) || this.isEndDate(date)) && this.startDate && this.endDate),
				isStartDate: this.isStartDate(date),
				isEndDate: this.isEndDate(date)
			};
			days.push(day);
		}

		return days;
	}

    /**
     * Get the days from the next month and fills the last week of the current
     *
     */
	getNextRestDays(year, month): Day[] {
		const monthLength = this.getDaysInMonth(year, month);
		const endOfTheMonth = new Date(year, month, monthLength).getDay();
		const nextDays = this.createDayArray(
			this.getYearOfNextMonth(year, month),
			this.getNextMonth(month),
			true
		).slice(0, 7 - endOfTheMonth);
		return nextDays.length > 6 ? [] : nextDays;
	}

    /**
     * Get the days of the previous month and fills the first week of the current
     */
	getPreviousRestDays(year, month): Day[] {
		const startOfTheMonth = new Date(year, month, 0).getDay();
		const previousDays = this.createDayArray(
			this.getYearOfPreviousMonth(year, month),
			this.getPreviousMonth(month),
			true
		);
		return previousDays.slice(previousDays.length - startOfTheMonth, previousDays.length);
	}

    /**
     * Merge all the day arrays together
     *
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
		return [{ weeks: weeks }];
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

			if (this.options.closeOnSelect) {
				this.close();
			}
		} else {
			this.deselectDate(date);

			if (this.options.closeOnSelect) {
				this.close();
			}
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
			this.selectedDates = this._selectedDates.filter(selectedDate => {
				return selectedDate.toDateString() !== toggleDate.toDateString();
			});
		} else {
			this._selectedDates.push(date);
			this.selectedDates = this._selectedDates.filter(selectedDate => {
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
		const selectedDates = [...this.selectedDates]
		
		if (unshift) {
			selectedDates.unshift(date);
		} else {
			selectedDates.push(date);
		}

		this.selectedDates = selectedDates;
	}

    /**
     * Deselect a date
     *
     * @param date
     */
	deselectDate(date: Date): void {
		this.selectedDates = this._selectedDates.filter(selectedDate => {
			return selectedDate.toDateString() !== date.toDateString();
		});
	}

    /**
     * Go to the next month
     */
	goToNextMonth(): void {
		this.year = this.getYearOfNextMonth(this.year, this.month);
		this.month = this.getNextMonth(this.month);
		this.currentMonthYear = [{ month: this.month, year: this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

    /**
     * Go to the previous month
     */
	goToPreviousMonth(): void {
		this.year = this.getYearOfPreviousMonth(this.year, this.month);
		this.month = this.getPreviousMonth(this.month);
		this.currentMonthYear = [{ month: this.month, year: this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

    /**
     * Go to a specific month
     *
     * @param date
     */
	goToDate(date: Date): void {
		this.month = date.getMonth();
		this.year = date.getFullYear();
		this.currentMonthYear = [{ month: this.month, year: this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Set the open state to true
	 */
	open(): void {
		if (this.isOpen) {
			return;
		}

		this.isOpen = true;
	}

	close(noTimeout?: boolean): void {
		if (!this.isOpen) {
			return;
		}

		const timeout = noTimeout ? this.options.timeoutBeforeClosing : 0;

		setTimeout(() => {
			this.isOpen = false;
		}, timeout);
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
		return this._selectedDates.map(date => date.toDateString()).indexOf(dateToCheck.toDateString()) !== -1;
	}

	isDisabled(date: Date): boolean {
		if (!this.minDate) {
			return !(date < this.maxDate);
		}

		if (!this.maxDate) {
			return !(date > this.minDate);
		}

		return !(date < this.maxDate && date > this.minDate);
	}

	isInRange(date: Date): boolean {
		return this.startDate && this.endDate && this.startDate < date && date < this.endDate;
	}

	getDaysInMonth(year: number, month: number): number {
		return [31, DatepickerComponent.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	isValidDate(value: any): boolean {
		let validDate = true;

		for (let i = 0; i < value.length; i++) {
			if (!this.isDate(value[i]) && validDate) {
				validDate = false;
			}
		}

		return validDate;
	}

	isDate(value: Date) {
		return value instanceof Date;
	}
}
