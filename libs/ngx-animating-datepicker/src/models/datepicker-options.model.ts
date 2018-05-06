export interface Options {
	selectMultiple: boolean; // Select multiple dates
	closeOnSelect: boolean; // Close datepicker when date(s) selected
	animationSpeed: number; // Animation speed in ms
	easing: string; // Easing type string
	hideRestDays: boolean; // hide the rest days
	hideNavigation: boolean; // Hide the navigation
	disableRestDays: boolean; // disable the click on rest days
	range: boolean; // Use range functionality
	currentDate: Date; // Tne current displayed date (month, year)
	timeoutBeforeClosing: number; // The timeout / delay before closing
	weekdayFormat: string;  // "narrow", "short", "long"
	weekStart: string; // 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
}
