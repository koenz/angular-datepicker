import {Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, HostBinding} from '@angular/core';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {

	@Output() onPreviousClick: EventEmitter<null> = new EventEmitter();
	@Output() onNextClick: EventEmitter<null> = new EventEmitter();

	@Input() private monthFormat = 'short' // "narrow", "short", "long";
	@Input() private language: string = navigator.language;
	@Input() private currentMonthYear: Object = null;
	@Input() public transition;
	@Input() public translateX;
	@Input() public leftPosition;

	@HostBinding('class.is-animate')
	@Input() public animate = false;

	private formatMonth = new Intl.DateTimeFormat(this.language, {month: this.monthFormat});
	public titleArray;

	ngOnInit() {
		this.setTitle(this.currentMonthYear);
	}

	/**
	 * ngOnChanges detects the changes made in component properties
	 * 
	 * @param changes
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (changes.currentMonthYear && !changes.currentMonthYear.firstChange) {
			this.setTitle(changes.currentMonthYear.currentValue);
		}
	}

	/**
	 * Sets the title
	 * 
	 * @param currentMonthYear 
	 */
	setTitle(currentMonthYear): void {
		// TODO: maybe use setter instead of ngOnchanges
		this.titleArray = currentMonthYear.map(el => {
			let date = new Date(el.year, el.month);
			el.month = this.formatMonth.format(date);
			return el;
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
