import { Component, EventEmitter, HostBinding, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'aa-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnChanges {
	@Output() onPreviousClick: EventEmitter<null> = new EventEmitter();
	@Output() onNextClick: EventEmitter<null> = new EventEmitter();

	@Input() private monthFormat = 'long'; // "narrow", "short", "long";
	@Input() private language: string = navigator.language;
	@Input() private currentMonthYear: Object = null;
	@Input() public transition;
	@Input() public translateX;
	@Input() public leftPosition;
	@Input() public hideNavigation;

	@HostBinding('class.is-animate') @Input() public animate = false;

	private formatMonth;
	public titleArray;

	/**
	 * ngOnChanges detects the changes made in component properties
	 *
	 * @param changes
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (this.language) {
			this.formatMonth = new Intl.DateTimeFormat(this.language, { month: this.monthFormat });
		}

		if (
			changes.currentMonthYear &&
			!changes.currentMonthYear.firstChange &&
			changes.currentMonthYear.currentValue.month !== undefined &&
			changes.currentMonthYear.currentValue.year !== undefined
		) {
			this.setTitle(changes.currentMonthYear.currentValue);
		}
		if (this.currentMonthYear) {
			this.setTitle(this.currentMonthYear);
		}
	}

	/**
	 * Sets the title
	 *
	 * @param currentMonthYear
	 */
	setTitle(currentMonthYear): void {
		// TODO: maybe use setter instead of ngOnChanges
		// TODO: copy the object / remove the reference
		this.titleArray = currentMonthYear.map(s => {
			const date = new Date(s.year, s.month);
			s.m = this.formatMonth.format(date);
			return s;
		});
	}

	/**
	 * Emits previous click event
	 */
	previous(): void {
		this.onPreviousClick.emit();
	}

	/**
	 * Emits next click event
	 */
	next(): void {
		this.onNextClick.emit();
	}
}
