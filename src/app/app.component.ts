import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app';

	public animateOptions = {
		theme: '', // Theme string is added to the host
		selectMultiple: false, // Select multiple dates
		showRestDays: true, // Show the rest days from previous and next months
		closeOnSelect: true,  // Close datepicker when date(s) selected
		animate: false, // Animate the datepicker
		animationSpeed: 400, // Animation speed in ms
		easing: 'ease-in', // Easing type string
		numberOfMonths: 1, // Number of months shown
		slideBy: null, // Number of months shown
		hideRestDays: false, // hide the rest days
		disableRestDays: true, // disable the click on rest days
		range: false, // Use range functionality
		min: null, // Disables dates until this date
		max: null // Disables dates from this date
	}
}
