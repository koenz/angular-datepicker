import { Component, OnInit, Input, ElementRef, ViewChild, HostBinding } from '@angular/core';
import { DatepickerComponent } from 'app/datepicker/datepicker.component';
import { Month } from "app/common/models/datepicker.model";
import { Options } from 'app/common/models/datepicker-options.model';
import { UtilitiesService } from 'app/common/services/utilities.service.';

@Component({
	selector: 'app-animatepicker',
	templateUrl: './animatepicker.component.html',
	styleUrls: ['./animatepicker.component.scss']
})
export class AnimatepickerComponent extends DatepickerComponent {

	@Input() public userOptions;
	public animate = true;
	public calendarWidth;
	public isAnimating = false;
	public leftPosition = 0;
	public transition: string;
	public translateX: number;

	public currentYearMonth;

	@ViewChild('calendarContainer') public calendarContainer: ElementRef;
	@ViewChild('calendarTopContainer') public calendarTopContainer: ElementRef;
	@HostBinding('style.width.px') public datepickerWidth: number;
	@HostBinding('style.height.px') public datepickerHeight: number;

	constructor(public elementRef: ElementRef, public utilities: UtilitiesService) {
		super();

		this.options = Object.assign({}, this.defaults, this.userOptions);
		this.numberOfMonths = new Array(this.options.numberOfMonths);
		this.calendarWidth = 50 / this.options.numberOfMonths
		console.log('sdsd',  this.options);
		console.log(this.userOptions);
	}

	ngOnInit() {
		this.currentYearMonth = this.getNextYearMonthArray(this.year, this.month);
		this.months = this.getNextMonthArray(this.currentYearMonth, true);
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.datepickerHeight = this.calendarContainer.nativeElement.offsetHeight + this.calendarTopContainer.nativeElement.offsetHeight;
			this.datepickerWidth = this.elementRef.nativeElement.offsetWidth * this.options.numberOfMonths;
		}, 1);
	}

	/**
	 * Create an array of the next year and months
	 * 
	 * @param year 
	 * @param month 
	 */
	getNextYearMonthArray(year: number, month: number): Object[] {
		let array = []
		for (var index = 0; index < this.options.numberOfMonths; index++) {
			array.push({ 'year': year, 'month': month });
			month = this.getNextMonth(month);
			year = this.getYearOfNextMonth(year, month);
		}

		return array;
	}

	/**
	 * Create an array of the next previous and months
	 * 
	 * @param year 
	 * @param month 
	 */
	getPreviousYearMonthArray(year: number, month: number): Object[] {
		let array = []
		for (var index = 0; index < this.options.numberOfMonths; index++) {
			array.unshift({ 'year': year, 'month': month });
			month = this.getPreviousMonth(month);
			year = this.getYearOfPreviousMonth(year, month);
		}

		return array;
	}

	/**
	 * Set the datepicker height, used when animating
	 * 
	 * @param directionRight - Set optional when sliding to the right
	 */
	setDatepickerHeight(directionRight?: boolean) {
		let indexArray;

		if (this.options.numberOfMonths > 1) {
			const start = directionRight ? 0 : this.options.numberOfMonths;
			const end = directionRight ? this.options.numberOfMonths - 1 : this.options.numberOfMonths + this.options.numberOfMonths - 1;
			indexArray = this.utilities.createArray(start, end);
		} else {
			indexArray = directionRight ? [0] : [1];
		}

		let that = this;
		setTimeout(function () {
			const calendarArray = that.elementRef.nativeElement.querySelectorAll('.datepicker__calendar-container');
			let offsetHeight;
			indexArray.forEach(el => {
				if (offsetHeight === undefined || calendarArray[el].offsetHeight > offsetHeight) {
					offsetHeight = calendarArray[el].offsetHeight;
				}
			});
			that.datepickerHeight = offsetHeight + that.calendarTopContainer.nativeElement.offsetHeight;
		});
	}

	/**
	 * Get next month array, gets multiple months.
	 * Used when the options animate is set or multiple months are visable 
	 * 
	 * @return Month[]
	 */
	getNextMonthArray(currentYearMonth, keepDate = false): Month[] {

		// Get the last index, used for selecting the right year month object
		const lastIndex = this.options.numberOfMonths - 1;

		// Get next year and month in an Object
		const nextMonths = this.getNextYearMonthArray(
			this.getYearOfNextMonth(currentYearMonth[lastIndex].year, currentYearMonth[lastIndex].month),
			this.getNextMonth(currentYearMonth[lastIndex].month)
		);

		// Concatonate the two objects to create a total year and month object
		this.currentMonthYear = currentYearMonth.concat(nextMonths);

		// Create the calendar array using the total year and month Object
		let monthArray = [];
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
	 * @param month 
	 * @param year 
	 * @param keepDate 
	 */
	getPreviousMonthArray(currentYearMonth, keepDate = false): Month[] {

		// Get previous year and month in an Object
		const previousMonths = this.getPreviousYearMonthArray(
			this.getYearOfPreviousMonth(currentYearMonth[0].year, currentYearMonth[0].month),
			this.getPreviousMonth(currentYearMonth[0].month)
		);

		// Concatonate the two objects to create a total year and month object
		this.currentMonthYear = previousMonths.concat(currentYearMonth);

		// Create the calendar array using the total year and month Object
		let monthArray = [];
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
		} else {
			this.deselectDate(date);
		}

		this.resetStyle();
		this.months = this.getNextMonthArray(this.currentYearMonth, true);

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
	 * Slide to the right
	 */
	slideRight(): void {
		this.setIsAnimating();
		setTimeout(() => {
			this.transition = 'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
			this.translateX = 50;
		});
	}

	/**
	 * Slide to the left
	 */
	slideLeft(): void {
		this.setIsAnimating();
		setTimeout(() => {
			this.transition = 'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
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
		this.leftPosition = resetForPrevious ? -100 : 0;
	}
}
