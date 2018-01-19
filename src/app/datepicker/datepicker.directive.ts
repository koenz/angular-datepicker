import { Directive, Input, ViewContainerRef, ComponentFactoryResolver, HostListener, OnInit, ApplicationRef, Injector } from '@angular/core';
import { Options } from 'app/common/models/datepicker-options.model';
import { DatepickerComponent } from 'app/datepicker/datepicker.component';
import { log } from 'util';
import { UtilitiesService } from '../common/services/utilities.service.';


@Directive({
  selector: '[appDatepicker]'
})
export class DatepickerDirective implements OnInit {
	datepicker: DatepickerComponent = null;
	month: any;
	year: any;

	public options: Options;
	@Input('options') _options: Options;
	public defaults: Options = {
		theme: '', // Theme string is added to the host
		selectMultiple: false, // Select multiple dates
		closeOnSelect: true,  // Close datepicker when date(s) selected
		animate: false, // Animate the datepicker
		animationSpeed: 400, // Animation speed in ms
		easing: 'ease-in', // Easing type string
		numberOfMonths: 1, // Number of months shown
		hideRestDays: false, // Hide the rest days
		disableRestDays: true, // Disable the click on rest days
		hideNavigation: false, // Hide the navigation
		range: false, // Use range functionality
		min: null, // Disables dates until this date
		max: null, // Disables dates from this date
		year: this.year, // Initial year that is displayed
		month: this.month // Initial month that is displayed
	};

	@HostListener('focus', ['$event.target'])
	onFocus() {		
		if(!this.datepicker){
			this.datepicker = this.createDatepicker();
		} 
		this.datepicker.open();
	}

	@HostListener('blur', ['$event.target'])
	onBlur() {
		// this.datepicker.close();
	}

	constructor(
		public utils: UtilitiesService, 
		public viewContainerRef: ViewContainerRef, 
		public componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector
	) { }

	ngOnInit(){
		this.utils.getPageOffset(this.viewContainerRef.element.nativeElement);
	}

	createDatepicker(): DatepickerComponent {
		const factory = this.componentFactoryResolver.resolveComponentFactory(DatepickerComponent);
		return this.viewContainerRef.createComponent(factory).instance;
	  }

}
