export interface Options {
	theme: string; // Theme string is added to the host
	selectMultiple: boolean; // Select multiple dates
	closeOnSelect: boolean; // Close datepicker when date(s) selected
	animate: boolean;  // Animate the datepicker
	animationSpeed: number; // Animation speed in ms
	easing: string; // Easing type string
	numberOfMonths: number; // Number of months shown
	hideRestDays: boolean; // hide the rest days
	hideNavigation: boolean; // Hide the navigation
	disableRestDays: boolean; // disable the click on rest days
	range: boolean; // Use range functionality
	min: Date; // Disables dates until this date
	max: Date; // Disables dates from this date
	year: number; // Initial year that is displayed
	month: number; // Initial month that is displayed
	appendToBody: boolean; // Append the body, default false
	openDirection: string; // 
}
