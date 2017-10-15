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
	
	public animate = true;	
	public calendarWidth = 50 / this.options.numberOfMonths;
	public isAnimating = false;
	public leftPosition = 0;
	public transition: string;
	public translateX: number;

	@ViewChild('calendarContainer') public calendarContainer: ElementRef;
	@ViewChild('calendarTopContainer') public calendarTopContainer: ElementRef;
	@HostBinding('style.width.px') public datepickerWidth: number;
	@HostBinding('style.height.px') public datepickerHeight: number;

	constructor(public elementRef: ElementRef, public utilities: UtilitiesService) {
		super();
	}

	ngOnInit() {
		this.getCurrentYearMonth();
		this.months = this.getNextMonthArray(this.month, this.year, true);
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.datepickerHeight = this.calendarContainer.nativeElement.offsetHeight + this.calendarTopContainer.nativeElement.offsetHeight;
			this.datepickerWidth = this.elementRef.nativeElement.offsetWidth * this.options.numberOfMonths;
		}, 1);
	}

	/**
	 * 
	 */
	getCurrentYearMonth(){
		
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
	getNextMonthArray(month: number, year: number, keepDate = false): Month[] {
		let array = [];
		let times = this.options.numberOfMonths * 2;

		for (var index = 0; index < times; index++) {
			array[index] = { 'month': month, 'year': year };
			month = this.getNextMonth(month);
			year = this.getYearOfNextMonth(year, month);

			if (!keepDate && index === (this.options.numberOfMonths - 1)) {
				this.month = month;
				this.year = year;
			}
		}

		let monthArray = []
		array.forEach(e => {
			monthArray.push(this.createCalendarArray(e.year, e.month));
		});

		this.resetStyle();
		this.currentMonthYear = array;

		return [].concat.apply([], monthArray);;
	}

	/**
	 * Gets an array of previous months. 
	 * Used for animation and when more months are displayed
	 * 
	 * @param month 
	 * @param year 
	 * @param keepDate 
	 */
	getPreviousMonthArray(month: number, year: number, keepDate = false): Month[] {
		let array = [];
		let times = this.options.numberOfMonths * 2;

		for (var index = 0; index < times; index++) {

			array[index] = { 'month': month, 'year': year };

			month = this.getPreviousMonth(month);
			year = this.getYearOfPreviousMonth(year, month);

			if (!keepDate) {
				if (index === (this.options.numberOfMonths - 1)) {
					this.month = month;
					this.year = year;
				}
			}
		}

		let previousArray = [];
		array.reverse().forEach(e => {
			previousArray.push(this.createCalendarArray(e.year, e.month));
		});

		this.resetStyle(true);
		this.currentMonthYear = array;

		return [].concat.apply([], previousArray);;
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
		this.months = this.getNextMonthArray(this.month, this.year, true);

	}

	/**
	 * Go to the next month
	 */
	goToNextMonth(): void {
		if (this.isAnimating) {
			return;
		}

		this.months = this.getNextMonthArray(this.month, this.year);
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

		this.months = this.getPreviousMonthArray(this.month, this.year);

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
		}, 1);

	}

	/**
	 * Slide to the left
	 */
	slideLeft(): void {
		this.setIsAnimating();
		setTimeout(() => {
			this.transition = 'transform ' + this.options.animationSpeed + 'ms ' + this.options.easing;
			this.translateX = -50;
		}, 100);
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
