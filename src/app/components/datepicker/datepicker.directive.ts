import { Directive, Input, ViewContainerRef, ComponentFactoryResolver, HostListener, OnInit, ApplicationRef, Injector, EmbeddedViewRef, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Options } from 'app/models/datepicker-options.model';
import { DatepickerComponent } from 'app/components/datepicker/datepicker.component';
import { UtilitiesService } from 'app/services/utilities.service.';
import { DatepickerService } from 'app/components/datepicker/datepicker.service.';
import { DirectiveOptions } from 'app/models/directive-options.model';
import { DefaultDirectiveOptions } from './datepicker.options'


@Directive({
	selector: '[aDatepicker]'
})
export class DatepickerDirective {
	datepicker: DatepickerComponent = null;
	clickListener;
	
	_options = DefaultDirectiveOptions;
	@Input('aDatepicker')
	set options(options: DirectiveOptions) {			
		if(options === undefined || !options) {
			return;
		}
		console.log(options);
		this._options = Object.assign(this._options, options);
	}
	get options(): DirectiveOptions {
		return this._options;
	}

	_datepickerOptions;
	@Input()
	set datepickerOptions(options: Options) {
		this.datepicker._options = options;
	}

	@HostListener('click', ['$event.target'])
	onClick() {
		if (!this.datepicker) {
			this.datepicker = this.createDatepicker();
			// ToDo hava a look at this. Set to false if is directive
			this.datepicker.isOpen = false;
			this.datepicker.selectedDates = this._selectedDates;
			this.datepicker.asDirective = true;
			this.subvscribestuff();
		}

		if (!this.datepicker.isOpen) {
			this.setPosition();
			this.datepicker.open();

			if (this.options.closeOnBlur) {
				setTimeout(() =>
					this.clickListener = this.renderer.listen('document', 'click', this.onBlurHandler.bind(this))
				);
			}
		}
	}

	/**
	 * Selected Dates: handles the selected dates array. Can be set both internally and externally
	 */
	private _selectedDates: Date[] = [];
	@Output() selectedDatesChange = new EventEmitter();
	@Input()
	get selectedDates(): Date[] { return this._selectedDates; }
	set selectedDates(value: Date[]) {
		if (value === undefined || this._selectedDates === value) {
			return;
		}
		this._selectedDates = value;
		this.selectedDatesChange.emit(this._selectedDates);
	}

	constructor(
		public utils: UtilitiesService,
		public viewContainerRef: ViewContainerRef,
		public componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector,
		private datepickerService: DatepickerService,
		private renderer: Renderer2
	) {	}

	subvscribestuff() {
		this.datepicker.selectedDatesChange.subscribe((date) => {
			this.selectedDates = date;
		});
	}
	/**
	 * Handles the (faked) blur event
	 * 
	 * @param event 
	 */
	onBlurHandler(event: Event): void {
		if (!this.datepicker.element.nativeElement.contains(event.target)) { // check click origin
			this.clickListener()
			this.datepicker.close();
		}
	}

	/** 
	 * Returns a create DatepickerComponent method
	*/
	createDatepicker(): DatepickerComponent {
		return this.options.appendToBody ? this.appendToBody() : this.appendToContainer();
	}

	/** 
	 * Sets the position of the datepicker
	*/
	setPosition() {
		const position = this.utils.getPageOffset(this.viewContainerRef.element.nativeElement);
		if (this.options.openDirection === 'bottom') {
			this.datepicker.topPosition = position.bottom;
			this.datepicker.leftPosition = position.left;
		}

		if (this.options.openDirection === 'left') {
			this.datepicker.topPosition = position.top;
			this.datepicker.rightPosition = position.forRight;
		}

		if (this.options.openDirection === 'right') {
			this.datepicker.topPosition = position.top;
			this.datepicker.leftPosition = position.right;
		}

		if (this.options.openDirection === 'top') {
			this.datepicker.bottomPosition = position.forBottom;
			this.datepicker.leftPosition = position.left;
		}
	}

	/**
	 * Appends the DatepickerComponent to the body and returns the instance
	 */
	appendToBody(): DatepickerComponent {
		const componentRef = this.componentFactoryResolver.resolveComponentFactory(DatepickerComponent).create(this.injector);

		this.appRef.attachView(componentRef.hostView);

		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

		document.body.appendChild(domElem);

		return componentRef.instance;
	}

	/**
	 * Appends the DatepickerComponent to the container and returns the instance
	 */
	appendToContainer(): DatepickerComponent {
		const componentRef = this.componentFactoryResolver.resolveComponentFactory(DatepickerComponent);
		return this.viewContainerRef.createComponent(componentRef).instance;
	}
}
