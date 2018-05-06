import {
	ApplicationRef,
	ComponentFactoryResolver,
	Directive,
	EmbeddedViewRef,
	EventEmitter,
	HostListener,
	Injector,
	Input,
	Output,
	Renderer2,
	ViewContainerRef
} from '@angular/core';
import { Options } from '../../models/datepicker-options.model';
import { DirectiveOptions } from '../../models/directive-options.model';
import { UtilitiesService } from '../../services/utilities.service';
import { AnimatepickerComponent } from '../animatepicker/animatepicker.component';
import { DatepickerComponent } from './datepicker.component';
import { DefaultDirectiveOptions } from './datepicker.options';

@Directive({
	selector: '[aaDatepicker]'
})
export class DatepickerDirective {
	datepicker: any = null; // TODO: fix types: DatepickerComponent | AnimatepickerComponent
	clickListener;

	_options = DefaultDirectiveOptions;
	@Input('aaDatepicker')
	set options(options: DirectiveOptions) {
		if (options === undefined || !options) {
			return;
		}
		this._options = { ...this._options, ...options };
	}
	get options(): DirectiveOptions {
		return this._options;
	}

	private _datepickerOptions;
	@Input('options')
	set datepickerOptions(options: Options) {
		this._datepickerOptions = options;

		if (this.datepicker) {
			this.datepicker.options = options;
		}
	}
	get datepickerOptions() {
		return this._datepickerOptions;
	}

	/**
	 * Set the the language manualy. A string with a BCP 47 language tag
	 * @example nl-NL
	 */
	private _language;
	@Input()
	set language(value: string) {
		this._language = value;

		if (this.datepicker) {
			this.datepicker.language = value;
		}
	}

	/**
	 * Minimal Date: If set the dates before it will be disabled
	 */
	private _minDate;
	@Input()
	set minDate(value: Date) {
		this._minDate = value;

		if (this.datepicker) {
			this.datepicker.minDate = value;
		}
	}
	get minDate() {
		return this._minDate;
	}

	/**
	 * Maximal Date: If set the dates after it will be disabled
	 */
	private _maxDate;
	@Input()
	set maxDate(value: Date) {
		this._maxDate = value;

		if (this.datepicker) {
			this.datepicker.maxDate = value;
		}
	}
	get maxDate() {
		return this._minDate;
	}

	/**
	 * Number of months: the number of months displayed
	 */
	private _numberOfMonths;
	@Input()
	set numberOfMonths(value) {
		this._numberOfMonths = value;

		if (this.datepicker) {
			this.datepicker.numberOfMonths = value;
		}
	}
	get numberOfMonths() {
		return this._numberOfMonths;
	}

	/**
	 * Theme string is added to the host
	 */
	private _theme;
	@Input()
	set theme(value) {
		if (this.datepicker) {
			this.datepicker.theme = value;
		}
	}
	get theme() {
		return this._theme;
	}

	/**
	 * The open state
	 */
	private _isOpen;
	@Input()
	set isOpen(value) {
		this._isOpen = value;

		if (this.datepicker) {
			this.datepicker.isOpen = value;
		}
	}
	get isOpen() {
		return this._isOpen;
	}

	/**
	 * Selected Dates: handles the selected dates array. Can be set both internally and externally
	 */
	private _selectedDates: Date[] = [];
	@Output() selectedDatesChange = new EventEmitter();
	@Input()
	set selectedDates(value: Date[]) {
		if (value === undefined || this._selectedDates === value) {
			return;
		}

		this._selectedDates = value;
		this.selectedDatesChange.emit(this._selectedDates);
	}
	get selectedDates(): Date[] {
		return this._selectedDates;
	}

	@HostListener('click', ['$event.target'])
	onClick() {
		if (!this.datepicker) {
			this.datepicker = this.createDatepicker();

			this.setDatepickerOptionsAndInputs();
			this.subscribeToSelectedChanges();
		}

		if (!this.datepicker.isOpen) {
			if (this.options.appendToBody) {
				this.setPosition();
			}
			this.datepicker.open();

			if (this.options.closeOnBlur) {
				setTimeout(
					() =>
						(this.clickListener = this.renderer.listen(
							'document',
							'click',
							this.onBlurHandler.bind(this)
						))
				);
			}
		}
	}

	constructor(
		public utils: UtilitiesService,
		public viewContainerRef: ViewContainerRef,
		public componentFactoryResolver: ComponentFactoryResolver,
		private appRef: ApplicationRef,
		private injector: Injector,
		private renderer: Renderer2
	) {}

	/**
	 * Add selected changes
	 */
	subscribeToSelectedChanges(): void {
		this.datepicker.selectedDatesChange.subscribe(date => {
			this.selectedDates = date;
		});
	}

	setDatepickerOptionsAndInputs() {
		this.datepicker.options = this.datepickerOptions;
		this.datepicker.isOpen = this.isOpen || false;
		this.datepicker.asDirective = true;
		this.datepicker.numberOfMonths = this.numberOfMonths;
		this.datepicker.theme = this.theme;
		this.datepicker._selectedDates = this.selectedDates;
		this.datepicker.language = this.language;
		this.datepicker.minDate = this.minDate;
		this.datepicker.minDate = this.maxDate;
	}

	/**
	 * Handles the (faked) blur event
	 *
	 * @param event
	 */
	onBlurHandler(event: Event): void {
		if (!this.datepicker.element.nativeElement.contains(event.target)) {
			// check click origin
			this.clickListener();
			this.datepicker.close();
		}
	}

	/**
	 * Returns a create DatepickerComponent method
	 */
	createDatepicker(): any {
		return this.options.appendToBody ? this.appendToBody() : this.appendToContainer();
	}

	/**
	 * Sets the position of the datepicker
	 */
	setPosition() {
		const position = UtilitiesService.getPageOffset(this.viewContainerRef.element.nativeElement);
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
	appendToBody(): any {
		const datepickerComponent = this.options.useAnimatePicker
			? AnimatepickerComponent
			: DatepickerComponent;
		const componentRef = this.componentFactoryResolver
			.resolveComponentFactory(datepickerComponent)
			.create(this.injector);

		this.appRef.attachView(componentRef.hostView);

		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

		document.body.appendChild(domElem);

		return componentRef.instance;
	}

	/**
	 * Appends the DatepickerComponent to the container and returns the instance
	 */
	appendToContainer(): any {
		const datepickerComponent = this.options.useAnimatePicker
			? AnimatepickerComponent
			: DatepickerComponent;
		const componentRef = this.componentFactoryResolver.resolveComponentFactory(
			datepickerComponent
		);
		return this.viewContainerRef.createComponent(componentRef).instance;
	}
}
