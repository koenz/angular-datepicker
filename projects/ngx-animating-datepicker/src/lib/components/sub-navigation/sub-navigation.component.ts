import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationItem } from '../../models/datepicker.model';

@Component({
	selector: 'aa-sub-navigation',
	templateUrl: './sub-navigation.component.html',
	styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent {
	@Output() close: EventEmitter<null> = new EventEmitter();
	@Output() subNavigationClick: EventEmitter<Date> = new EventEmitter();
	@Input() public navigationItems: NavigationItem[];

	onItemCLick(navigationItem: NavigationItem) {
		const date = new Date(navigationItem.year, navigationItem.month);
		this.close.emit();
		this.subNavigationClick.emit(date);
	}
}
