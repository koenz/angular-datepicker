import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {YearMonth, NavigationItem} from '../../models/datepicker.model';

@Component({
	selector: 'aa-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
	@Output() public previousClick: EventEmitter<null> = new EventEmitter();
	@Output() public nextClick: EventEmitter<null> = new EventEmitter();
	@Output() public subNavigationClick: EventEmitter<Date> = new EventEmitter();
	@Input() private monthFormat = 'long'; 	// "narrow", "short", "long";

	@Input()
	private set language(language: string) {
		this.formatMonth = new Intl.DateTimeFormat(language, {month: this.monthFormat});
		this._language = language;

		if (this.initialised) {
			this.titles = this.createNavigationItems(this._totalYearMonth);
		}
	}

	private get language(): string {
		return this._language;
	}

	private _totalYearMonth: YearMonth[];
	@Input()
	public set totalYearMonth(totalYearMonth: YearMonth[]) {
		this._totalYearMonth = totalYearMonth;
		this.titles = this.createNavigationItems(totalYearMonth);
	}

	@Input() public transition: string;
	@Input() public translateX: number;
	@Input() public leftPosition: number;
	@Input() public hideNavigation: boolean;

	@HostBinding('class.is-animate')
	@Input()
	public animate = false;

	private _language: string;
	private initialised = false;
	private formatMonth: Intl.DateTimeFormat;
	private subNavigationOpen = false;
	public navigationItems: NavigationItem[];
	public titles: NavigationItem[];

	ngOnInit() {
		this.initialised = true;
	}

	onMonthClick(title: NavigationItem) {
		const monthArray = this.createMonthArray(title);
		const formatMonth = new Intl.DateTimeFormat(this.language, {month: 'short'});
		this.navigationItems = this.createNavigationItems(monthArray, true, formatMonth);
		this.toggleSubNavigation();
	}

	onYearClick(title: NavigationItem) {
		this.navigationItems = this.createYearArray(title);
		this.toggleSubNavigation();
	}

	toggleSubNavigation() {
		this.subNavigationOpen = !this.subNavigationOpen;
	}

	/**
	 * Sets the title
	 *
	 * @param {YearMonth[]} totalMonthYear
	 * @param {boolean} monthType
	 * @param {Intl.DateTimeFormat} formatMonth
	 * @returns {NavigationItem[]}
	 */
	createNavigationItems(totalMonthYear: YearMonth[], monthType = true, formatMonth = null): NavigationItem[] {
		const _formatMonth = formatMonth || this.formatMonth;

		// TODO: copy the object / remove the reference
		return (<NavigationItem[]>totalMonthYear).map(s => {
			const date = new Date(s.year, s.month);
			s.navigationTitle = monthType ? _formatMonth.format(date) : s.year;
			return s;
		});
	}

	createMonthArray(navigationItem: NavigationItem) {
		const months = [],
			currentYear = navigationItem.year;
		for (let i = 0; i < 11; i++) {
			months.push({month: i, year: currentYear});
		}

		return months;
	}

	/**
	 * Create an array of navigation items with year as label
	 *
	 * @param {NavigationItem} navigationItem
	 * @returns {NavigationItem[]}
	 */
	createYearArray(navigationItem: NavigationItem): NavigationItem[] {
		const currentYear = navigationItem.year,
			years = [{...navigationItem, navigationTitle: currentYear}];

		for (let i = 0; i < 5; i++) {
			years.unshift({...navigationItem, navigationTitle: currentYear - (i + 1)});
			years.push({...navigationItem, navigationTitle: currentYear + (i + 1)});
		}

		return years;
	}

	onSubNavigationClick(date: Date) {
		this.subNavigationClick.emit(date)
	}

	/**
	 * Emits previous click event
	 */
	previous(): void {
		this.previousClick.emit();
	}

	/**
	 * Emits next click event
	 */
	next(): void {
		this.nextClick.emit();
	}
}
