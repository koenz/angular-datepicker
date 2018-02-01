import { Directive, Input, ViewContainerRef, ComponentFactoryResolver, HostListener, OnInit, ApplicationRef, Injector, EmbeddedViewRef } from '@angular/core';
import { Options } from 'app/common/models/datepicker-options.model';
import { DatepickerComponent } from 'app/datepicker/datepicker.component';
import { log } from 'util';
import { UtilitiesService } from '../common/services/utilities.service.';


@Directive({
  selector: '[appDatepicker]'
})
export class DatepickerDirective {
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
		month: this.month, // Initial month that is displayed
		appendToBody: true,
		openDirection: 'bottom'
	};

	@HostListener('focus', ['$event.target'])
	onFocus() {		
		if(!this.datepicker){
			this.datepicker = this.createDatepicker();
		}
		this.setPosition();
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

	createDatepicker(){
		return this.defaults.appendToBody ? this.appendToBody() : this.appendToContainer();
	}

	setPosition(){
		const position = this.utils.getPageOffset(this.viewContainerRef.element.nativeElement);
		
		if(this.defaults.openDirection === 'bottom'){
			this.datepicker.topPosition = position.bottom;
			this.datepicker.leftPosition = position.left;
		}

		if(this.defaults.openDirection === 'left'){
			this.datepicker.topPosition = position.top;
			this.datepicker.rightPosition = position.forRight;
		}

		if(this.defaults.openDirection === 'right'){
			this.datepicker.topPosition = position.top;
			this.datepicker.leftPosition = position.right;
		}

		if(this.defaults.openDirection === 'top'){
			this.datepicker.bottomPosition = position.forBottom;
			this.datepicker.leftPosition = position.left;
		}
	}

	appendToBody(): DatepickerComponent {
		const componentRef = this.componentFactoryResolver.resolveComponentFactory(DatepickerComponent).create(this.injector);
		this.appRef.attachView(componentRef.hostView);

		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

		document.body.appendChild(domElem);	

		return componentRef.instance;
	}

	appendToContainer(): DatepickerComponent {
		const componentRef = this.componentFactoryResolver.resolveComponentFactory(DatepickerComponent);
		return this.viewContainerRef.createComponent(componentRef).instance;
	}
}
