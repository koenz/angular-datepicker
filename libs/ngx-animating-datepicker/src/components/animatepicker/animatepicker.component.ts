import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Input,
	OnInit,
	ViewChild
} from '@angular/core';
import { Month } from '../../models/datepicker.model';
import { DatepickerService } from '../../services/datepicker.service';
import { UtilitiesService } from '../../services/utilities.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';

@Component({
	selector: 'aa-animatepicker',
	templateUrl: './animatepicker.component.html',
	styleUrls: ['../datepicker/datepicker.component.scss']
})
export class AnimatepickerComponent extends DatepickerComponent implements OnInit, AfterViewInit {
	/* ==============================================
	 * Internal Properties
	 * ============================================== */

	public animate = true;
	public initialWidth: number;
	public calendarWidth: number;
	public isAnimating = false;
	public leftInnerPosition = 0;
	public transition: string;
	public translateX: number;
	public currentYearMonth: object = null;
	public datepickerPosition: object;

	/* ==============================================
	 * External Properties
	 * ============================================== */

	/**
	 * Number of months: the number of months displayed
	 */
	private _numberOfMonths: any = new Array(1);
	@Input()
	get numberOfMonths(): Number[] {
		return this._numberOfMonths;
	}
	set numberOfMonths(value) {
		if (value === undefined || value === this._numberOfMonths.length) {
			return;
		}
		this._numberOfMonths = new Array(value);
		this.setDatePickerDimension();
		this.goToDate(this.date);
	}

	/* ==============================================
	 * Bindings and Children
	 * ============================================== */

	@ViewChild('calendarContainer') public calendarContainer: ElementRef;
	@ViewChild('calendarTopContainer') public calendarTopContainer: ElementRef;
	@HostBinding('style.width.px') public datepickerWidth: number;
	@HostBinding('style.height.px') public datepickerHeight: number;

	constructor(public elementRef: ElementRef, public utilities: UtilitiesService) {
		super(utilities, elementRef);
	}

	ngOnInit() {
		// Get the computed width from the calendar. Set the initial width
		const computedWidth = window
			.getComputedStyle(this.elementRef.nativeElement, null)
			.getPropertyValue('width');
		this.initialWidth = parseInt(computedWidth, 10);

		// Set the current year and month object
		if (!this.month && !this.year) {
			this.goToDate(this.options.currentDate);
		}
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.setDatePickerDimension();
			this.setDatepickerHeight(true);
		});
	}

	/**
	 * Set the height and the width properties
	 */
	setDatePickerDimension(): void {
		this.datepickerHeight =
			this.calendarContainer.nativeElement.offsetHeight +
			this.calendarTopContainer.nativeElement.offsetHeight;
		this.datepickerWidth = this.initialWidth * this._numberOfMonths.length;
	}

	/**
	 * Go to a specific month
	 *
	 * @param date - optional
	 */
	goToDate(date?: Date): void {
		if (date) {
			this.currentYearMonth = this.getNextYearMonthArray(date.getFullYear(), date.getMonth());
		}
		this.calendarWidth = 50 / this._numberOfMonths.length;
		this.months = this.getNextMonthArray(this.currentYearMonth, true);
		this.resetStyle();
	}

	/**
	 * Create an array of the next year and months
	 *
	 * @param year
	 * @param month
	 */
	getNextYearMonthArray(year: number, month: number): Object[] {
		const array = [];
		for (let index = 0; index < this._numberOfMonths.length; index++) {
			array.push({ year: year, month: month });
			year = DatepickerService.getYearOfNextMonth(year, month);
			month = DatepickerService.getNextMonth(month);
		}
		return array;
	}

	/**
	 * Create an array of the previous year and months
	 *
	 * @param year
	 * @param month
	 */
	getPreviousYearMonthArray(year: number, month: number): Object[] {
		const array = [];
		for (let index = 0; index < this._numberOfMonths.length; index++) {
			array.unshift({ year: year, month: month });
			year = DatepickerService.getYearOfPreviousMonth(year, month);
			month = DatepickerService.getPreviousMonth(month);
		}
		return array;
	}

	/**
	 * Set the datepicker height, used when animating
	 *
	 * @param directionRight - Set optional when sliding to the right
	 */
	setDatepickerHeight(directionRight?: boolean): void {
		let indexArray;

		if (this._numberOfMonths.length > 1) {
			const start = directionRight ? 0 : this._numberOfMonths.length;
			const end = directionRight
				? this._numberOfMonths.length - 1
				: this._numberOfMonths.length + this._numberOfMonths.length - 1;
			indexArray = this.utilities.createArray(start, end);
		} else {
			indexArray = directionRight ? [0] : [1];
		}

		const that = this;
		setTimeout(function() {
			const calendarArray = that.elementRef.nativeElement.querySelectorAll(
				'.datepicker__calendar-container'
			);
			let offsetHeight = 0;
			indexArray.forEach(el => {
				if (offsetHeight === undefined || calendarArray[el].offsetHeight > offsetHeight) {
					offsetHeight = calendarArray[el].offsetHeight;
				}
			});
			that.datepickerHeight =
				offsetHeight + that.calendarTopContainer.nativeElement.offsetHeight;
		});
	}

	/**
	 * Get next month array, gets multiple months.
	 * Used when the options animate is set or multiple months are visable
	 *
	 * @return Month[]
	 */
	getNextMonthArray(currentYearMonth, keepDate = false, nextMonthsYearMonthArray?): Month[] {
		// Get the last index, used for selecting the right year month object
		const lastIndex = this._numberOfMonths.length - 1;

		// Get next year and month in an Object
		const nextMonths =
			nextMonthsYearMonthArray ||
			this.getNextYearMonthArray(
				DatepickerService.getYearOfNextMonth(
					currentYearMonth[lastIndex].year,
					currentYearMonth[lastIndex].month
				),
				DatepickerService.getNextMonth(currentYearMonth[lastIndex].month)
			);

		// Concatenates the two objects to create a total year and month object
		this.currentMonthYear = currentYearMonth.concat(nextMonths);

		// Create the calendar array using the total year and month Object
		const monthArray = [];
		this.currentMonthYear.forEach(e => {
			// TODO: Find out why I have to use the block quotes
			monthArray.push(this.createCalendarArray(e['year'], e['month']));
		});

		// Set the new current year and month object.
		if (!keepDate) {
			this.currentYearMonth = nextMonths;
		}

		return [].concat.apply([], monthArray);
	}

	/**
	 * Gets an array of previous months.
	 * Used for animation and when more months are displayed
	 *
	 * @param currentYearMonth
	 * @param keepDate
	 */
	getPreviousMonthArray(currentYearMonth, keepDate = false): Month[] {
		// Get previous year and month in an Object
		const previousMonths = this.getPreviousYearMonthArray(
			DatepickerService.getYearOfPreviousMonth(
				currentYearMonth[0].year,
				currentYearMonth[0].month
			),
			DatepickerService.getPreviousMonth(currentYearMonth[0].month)
		);

		// Concatenates the two objects to create a total year and month object
		this.currentMonthYear = previousMonths.concat(currentYearMonth);

		// Create the calendar array using the total year and month Object
		const monthArray = [];
		this.currentMonthYear.forEach(e => {
			monthArray.push(this.createCalendarArray(e['year'], e['month']));
		});

		// Set the new current year and month object.
		if (!keepDate) {
			this.currentYearMonth = previousMonths;
		}

		return [].concat.apply([], monthArray);
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
		this.months = this.getNextMonthArray(this.currentYearMonth, true);
		this.resetStyle();
	}

	/**
	 * Go to the next month
	 */
	goToNextMonth(): void {
		if (this.isAnimating) {
			return;
		}

		this.months = this.getNextMonthArray(this.currentYearMonth);
		this.resetStyle();
		this.setDatepickerHeight();
		this.slideLeft();
	}

	/**
	 * Go to the previous month
	 */
	goToPreviousMonth(): void {
		if (this.isAnimating) {
			return;
		}

		this.months = this.getPreviousMonthArray(this.currentYearMonth);
		this.resetStyle(true);
		this.setDatepickerHeight(true);
		this.slideRight();
	}

	/**
	 * Go to a specific month
	 * TODO: WIP Check if date is in current range, or if it is later or earlier
	 */
	goToMonth(date: Date): void {
		const nextMonths = this.getNextYearMonthArray(date.getFullYear(), date.getMonth());
		this.months = this.getNextMonthArray(this.currentMonthYear, false, nextMonths);
		this.resetStyle();
		this.setDatepickerHeight();
		this.slideRight();
	}

	/**
	 * Slide to the right
	 */
	slideRight(): void {
		this.setIsAnimating();
		setTimeout(() => {
			this.transition =
				'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
			this.translateX = 50;
		});
	}

	/**
	 * Slide to the left (criss cross)
	 */
	slideLeft(): void {
		this.setIsAnimating();
		setTimeout(() => {
			this.transition =
				'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
			this.translateX = -50;
		});
	}

	/**
	 * Set animating state
	 */
	setIsAnimating(): void {
		this.isAnimating = true;
		setTimeout(() => {
			this.isAnimating = false;
		}, this.options.animationSpeed);
	}

	/**
	 * Reset Style
	 *
	 * @param resetForPrevious - Optional
	 */
	resetStyle(resetForPrevious?: boolean) {
		this.transition = 'transform 0ms ease-in';
		this.translateX = 0;
		this.leftInnerPosition = resetForPrevious ? -100 : 0;
	}
}
