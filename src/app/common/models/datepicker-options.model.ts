export interface Options {
    theme: string; // Theme string is added to the host
    selectMultiple: boolean; // Select multiple dates
    showRestDays: boolean; // Show the rest days from previous and next months
    closeOnSelect: boolean; // Close datepicker when date(s) selected
    animate: boolean;  // Animate the datepicker
    animationSpeed: number; // Animation speed in ms
    easing: string; // Easing type string
    numberOfMonths: number; // Number of months shown
    slideBy: number; // Number of months shown
    hideRestDays: boolean; // hide the rest days
    disableRestDays: boolean; // disable the click on rest days
    range: boolean; // Use range functionality
    min: Date; // Disables dates until this date
    max: Date; // Disables dates from this date
}
