import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AnimatepickerComponent} from 'ngx-animating-datepicker';
import {
    DefaultDirectiveOptions,
    DefaultOptions
} from '../../../projects/ngx-animating-datepicker/src/lib/components/datepicker/datepicker.options';

@Component({
	selector: 'app-demo',
	templateUrl: './demo.component.html',
	styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
	public animateInputsForm: FormGroup;
	public animateOptionsForm: FormGroup;
	public basicInputsForm: FormGroup;
	public basicOptionsForm: FormGroup;
	public directiveOptionsForm: FormGroup;
	public selectedDirectiveDates;
	public selectedDatesAnimate;
	public directiveOptions;
	public animateOptions = {...DefaultOptions, hideRestDays: true};
	public basicOptions;
	public selectedBasicMinDate;
	public selectedBasicMaxDate;
	public selectedMinDate;
	public selectedMaxDate;
	public numberOfMonths;

	@ViewChild('demoDatepicker') demoDatepicker: AnimatepickerComponent;
	private directiveForm: FormGroup;

	ngOnInit() {
		this.directiveForm = new FormGroup({
			directiveFormControl: new FormControl()
		});

		this.animateOptionsForm = new FormGroup({
			selectMultiple: new FormControl(), // Select multiple dates
			closeOnSelect: new FormControl(), // Close datepicker when date(s) selected
			animationSpeed: new FormControl(), // Animation speed in ms
			easing: new FormControl(), // Easing type string
			hideRestDays: new FormControl(), // Hide the rest days
			disableRestDays: new FormControl(), // Disable the click on rest days
			hideNavigation: new FormControl(), // Hide the navigation
			range: new FormControl(), // Use range functionality
			currentDate: new FormControl(), // Tne current displayed date (month, year)
			timeoutBeforeClosing: new FormControl(), // The timeout / delay before closing
			weekdayFormat: new FormControl(), // "narrow", "short", "long"
			weekStart: new FormControl() // 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
		});

		this.basicOptionsForm = new FormGroup({
			selectMultiple: new FormControl(), // Select multiple dates
			closeOnSelect: new FormControl(), // Close datepicker when date(s) selected
			animationSpeed: new FormControl(), // Animation speed in ms
			easing: new FormControl(), // Easing type string
			hideRestDays: new FormControl(), // Hide the rest days
			disableRestDays: new FormControl(), // Disable the click on rest days
			hideNavigation: new FormControl(), // Hide the navigation
			range: new FormControl(), // Use range functionality
			currentDate: new FormControl(), // Tne current displayed date (month, year)
			timeoutBeforeClosing: new FormControl(), // The timeout / delay before closing
			weekdayFormat: new FormControl() // "narrow", "short", "long"
		});

		this.directiveOptionsForm = new FormGroup({
			appendToBody: new FormControl(), // Append Datepicker to the body else append to directive
			openDirection: new FormControl(), // Append Datepicker to the body
			closeOnBlur: new FormControl() // Close datepicker on blur
		});

		this.animateOptionsForm.patchValue(this.animateOptions);

		this.basicOptionsForm.patchValue(DefaultOptions);

		this.directiveOptionsForm.patchValue(DefaultDirectiveOptions);

		this.animateOptionsForm.valueChanges.subscribe(data => {
			this.animateOptions = data;
		});

		this.basicOptionsForm.valueChanges.subscribe(data => {
			this.basicOptions = data;
		});

		this.directiveOptionsForm.valueChanges.subscribe(data => {
			this.directiveOptions = data;
		});

		this.animateInputsForm = new FormGroup({
			minDate: new FormControl(), // Select multiple dates
			maxDate: new FormControl(), // Close datepicker when date(s) selected
			numberOfMonths: new FormControl(2), // Number of months shown
			language: new FormControl('en-EN'), // Set a language. example: nl-NL
			theme: new FormControl() // Set a theme class
		});

		this.basicInputsForm = new FormGroup({
			basicMinDate: new FormControl(), // Select multiple dates
			basicMaxDate: new FormControl(), // Close datepicker when date(s) selected
			theme: new FormControl() // Set a theme class
		});
	}

	removeDate(i) {
		this.selectedDatesAnimate.splice(i, 1);
		this.selectedDatesAnimate = [...this.selectedDatesAnimate];
	}

	close() {
		this.demoDatepicker.close();
	}

	open() {
		this.demoDatepicker.open();
	}

	next() {
		this.demoDatepicker.goToNextMonth();
	}

	previous() {
		this.demoDatepicker.goToPreviousMonth();
	}
}
