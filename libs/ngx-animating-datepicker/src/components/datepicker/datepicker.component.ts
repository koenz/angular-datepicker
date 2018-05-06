import {
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Input,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { Options } from '../../models/datepicker-options.model';
import { Day, Month, Week } from '../../models/datepicker.model';
import { DatepickerService } from '../../services/datepicker.service';
import { UtilitiesService } from '../../services/utilities.service';
import { DefaultOptions } from './datepicker.options';

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
	private weekDays = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday'
	];

	/* ==============================================
	 * Initial Options
	 * ============================================== */
	public _options: Options = DefaultOptions;
	@Input('options')
	set options(options) {
		if (options === undefined || !options) {
			return;
		}
		console.log(options);
		this._options = { ...this._options, ...options };

		if (options.currentDate !== undefined) {
			this.date = this.options.currentDate;
		}

		this.goToDate();
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
		if (!value || value === undefined || !DatepickerService.isValidIsoCode(value)) {
			return;
		}

		this._language = value;

		this.renderWeekdays();
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
		this.goToDate();
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
		this.goToDate();
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
		if (!DatepickerService.isValidDate(_value)) {
			return;
		}

		this._selectedDates = _value;

		if (this.options.range) {
			this.resetRange();
		}

		this.goToDate();

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
	@HostBinding('class')
	@Input()
	theme = '';
	@HostBinding('class.is-open')
	@Input()
	isOpen = true;
	@HostBinding('class.is-directive') asDirective = false;
	@HostBinding('class.is-animate') animate = false;
	@HostBinding('style.top.px') topPosition = null;
	@HostBinding('style.left.px') leftPosition = null;
	@HostBinding('style.bottom.px') bottomPosition = null;
	@HostBinding('style.right.px') rightPosition = null;

	constructor(public utils: UtilitiesService, public element: ElementRef) {}

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
		const daysInMonth = DatepickerService.getDaysInMonth(year, month);
		const weekStart = 1 + this.weekDays.indexOf(this.options.weekStart);

		for (let index = 0; index < daysInMonth; index++) {
			const dayNumber = index + weekStart;
			const date = new Date(year, month, dayNumber);
			const day = {
				date,
				dayNumber,
				isFirst: dayNumber === 1,
				isLast: dayNumber === daysInMonth,
				isToday: this.isToday(date),
				isSelected: this.isSelected(date),
				isRest: isRestDays,
				isHidden: isRestDays && this.options.hideRestDays,
				isDisabled:
					((this.minDate || this.maxDate) && this.isDisabled(date)) ||
					(isRestDays && this.options.disableRestDays),
				isInRange:
					this.isInRange(date) ||
					((this.isStartDate(date) || this.isEndDate(date)) &&
						this.startDate &&
						this.endDate),
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
	 * @param year
	 * @param month
	 */
	getNextRestDays(year: number, month: number): Day[] {
		const monthLength = DatepickerService.getDaysInMonth(year, month);
		const endOfTheMonth = new Date(year, month, monthLength).getDay();
		const nextDays = this.createDayArray(
			DatepickerService.getYearOfNextMonth(year, month),
			DatepickerService.getNextMonth(month),
			true
		).slice(0, 7 - endOfTheMonth);
		return nextDays.length > 6 ? [] : nextDays;
	}

	/**
	 * Get the days of the previous month and fills the first week of the current
	 *
	 * @param year
	 * @param month
	 */
	getPreviousRestDays(year: number, month: number): Day[] {
		const startOfTheMonth = new Date(year, month, 0).getDay();
		const previousDays = this.createDayArray(
			DatepickerService.getYearOfPreviousMonth(year, month),
			DatepickerService.getPreviousMonth(month),
			true
		);
		return previousDays.slice(previousDays.length - startOfTheMonth, previousDays.length);
	}

	/**
	 * Merge all the day arrays together
	 *
	 * @param year
	 * @param month
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
	 *
	 * @param year
	 * @param month
	 */
	createCalendarArray(year: number, month: number): [{ weeks: Week[] }] {
		const dayArray = this.getMergedDayArrays(year, month);
		const weeks = DatepickerService.createWeekArray(dayArray);
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
		} else if (DatepickerService.isEarlier(date, this.startDate)) {
			if (this.startDate) {
				this.toggleDate(date, this.startDate, true);
			} else {
				this.selectDate(date);
			}
			this.startDate = date;
			this.selectEndDate();
		} else if (this.endDate && DatepickerService.isLater(date, this.endDate)) {
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
		const selectedDates = [...this.selectedDates];

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
		this.year = DatepickerService.getYearOfNextMonth(this.year, this.month);
		this.month = DatepickerService.getNextMonth(this.month);
		this.currentMonthYear = [{ month: this.month, year: this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Go to the previous month
	 */
	goToPreviousMonth(): void {
		this.year = DatepickerService.getYearOfPreviousMonth(this.year, this.month);
		this.month = DatepickerService.getPreviousMonth(this.month);
		this.currentMonthYear = [{ month: this.month, year: this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Go to a specific month. Is also used to rerender the datepicker
	 *
	 * @param date - default is the current date.
	 */
	goToDate(date: Date = this.date): void {
		this.month = date.getMonth();
		this.year = date.getFullYear();
		this.currentMonthYear = [{ month: this.month, year: this.year }];
		this.months = this.createCalendarArray(this.year, this.month);
	}

	/**
	 * Render weekdays when options or language changes
	 */
	renderWeekdays() {
		this.weekdays = DatepickerService.getWeekDays(
			this._language,
			this.options.weekdayFormat,
			this.options.weekStart
		);
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

	/**
	 * Close the datepicker
	 *
	 * @param noTimeout - optional timeout
	 */
	close(noTimeout?: boolean): void {
		if (!this.isOpen) {
			return;
		}

		const timeout = noTimeout ? this.options.timeoutBeforeClosing : 0;

		setTimeout(() => {
			this.isOpen = false;
		}, timeout);
	}

	/**
	 * Select the start date - used for range functionality
	 */
	selectStartDate(): void {
		this.selectedRange = 'startDate';
	}

	/**
	 * Select the end date - used for range functionality
	 */
	selectEndDate(): void {
		this.selectedRange = 'endDate';
	}

	// TODO: maybe output the startDate and Endate or just of internal use
	/**
	 * Check if date is the start date
	 */
	isStartDate(date: Date): boolean {
		return this.startDate && date.toDateString() === this.startDate.toDateString();
	}

	/**
	 * Check if date is the end date
	 */
	isEndDate(date: Date): boolean {
		return this.endDate && date.toDateString() === this.endDate.toDateString();
	}

	/**
	 * Check if date is today
	 */
	isToday(date: Date): boolean {
		return date.toDateString() === this.today.toDateString();
	}

	/**
	 * Check if date is selected
	 */
	isSelected(dateToCheck: Date): boolean {
		return (
			this._selectedDates
				.map(date => date.toDateString())
				.indexOf(dateToCheck.toDateString()) !== -1
		);
	}

	/**
	 * Check if date is disabled
	 */
	isDisabled(date: Date): boolean {
		if (!this.minDate) {
			return !(date < this.maxDate);
		}

		if (!this.maxDate) {
			return !(date > this.minDate);
		}

		return !(date < this.maxDate && date > this.minDate);
	}

	/**
	 * Check if date is in range
	 */
	isInRange(date: Date): boolean {
		return this.startDate && this.endDate && this.startDate < date && date < this.endDate;
	}
}
