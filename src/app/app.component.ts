import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	public animatePickerOptions = {
		selectMultiple: false, // Select multiple dates
		showRestDays: false, // Show the rest days from previous and next months
		closeOnSelect: true,  // Close datepicker when date(s) selected
		animate: false, // Animate the datepicker
		animationSpeed: 400, // Animation speed in ms
		easing: 'ease-in', // Easing type string
		hideRestDays: true, // hide the rest days
		range: true // Use range functionality
	};

	public datePickerOptions = {
		selectMultiple: false, // Select multiple dates
		numberOfMonths: 2 // Number of months shown
	};
}
