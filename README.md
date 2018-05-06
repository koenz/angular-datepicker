# Animating Angular Datepicker
An Animating Datepicker for Angular 2+. For some smooth date picking :). Including range functionality, multiple calendars next to each other and loads of other functionality. Checkout the [Demo page](http://zigterman.com/datepicker) for a preview.

## Installation

To install go through the following steps

1.  `npm install ngx-animating-datepicker --save` -- or --
	`yarn add ngx-animating-datepicker`
2. Add `aaDatepickerModule` to your module imports:
```ts
import {aaDatepickerModule} from  'ngx-animating-datepicker';

@NgModule({
 ...
 imports: [
   ...
   aaDatepickerModule
 ]
}
```

## Basic Usage

Implement the datepicker component in one of the following ways

### 1. Inline Animatepicker
Implement aaAnimatepicker component inline

```html
<aa-animatepicker
	[options]="datepickerOptions"
	[(selectedDates)]="dates"></aa-animatepicker>
```
### 2. As Directive
Implement datepicker as a directive
```html
<input  
	type="text"  
	value="dates | date" 
	[options]="datepickerOptions" 
	[(selectedDates)]="dates" 
	aaDatepicker="directiveOptions" />
```
### Options
The options can be used for the inline- as well as the directive implementation.  

In the following example you'll see the default options:

```ts
datepickerOptions: Options = {
	selectMultiple: false, // Select multiple dates
	closeOnSelect: false, // Close datepicker when date(s) selected
	animationSpeed: 400, // Animation speed in ms
	easing: 'ease-in', // Easing type string
	hideRestDays: false, // Hide the rest days
	disableRestDays: true, // Disable the click on rest days
	hideNavigation: false, // Hide the navigation
	range: false, // Use range functionality
	currentDate: new Date(), // Tne current displayed date (month, year)
	timeoutBeforeClosing: 5000, // The timeout / delay before closing
	weekdayFormat: 'short', // "narrow", "short", "long"
	weekStart: 'monday' // Set the week start day
};
```

#### Directive options
These options can be used only on the directive like so

```html
<input aaDatepicker="directiveOptions" />
```
In the following example you'll see the default options
```ts
directiveOptions: DirectiveOptions = {
	appendToBody: true, // Append Datepicker to body
	openDirection: 'bottom', // The direction it should open to
	closeOnBlur: true  // Close the datepicker onBlur
	useAnimatePicker: true // Use the regular datepicker or the animating one
};
```

### @Input's()
The following inputs are available for the Animatepicker

```ts
 @Input() minDate: Date; // Disables dates until this date
 @Input() maxDate: Date; // Disables dates from this date
 @Input() language: string; // Set the locale string. Example: nl-NL
 @Input() numberOfMonths: number; // Number of months shown next to eachother
 @Input() selectedDates: Date | Date\[\]; // Also a @Output (two-way data bindend)
 @Input() theme: string; // Theme string is added to the host
 @Input() isOpen: boolean; // The open state
```

#### Directive @input's()
All the above @Input's() can be used with the directive implementation as well. Additionally, you can use these @Input's() for the directive. The assigned values are the default ones:


```ts
@Input() appendToBody = true; // Append Datepicker to the body else append to directive
@Input() openDirection = 'bottom'  // 'top', 'left', 'right', 'bottom'
@Input() closeOnBlur = true; // Close datepicker on blur
```
### Regular Datepicker Component
The Animatepicker is an extension of the regular datepicker component. Don't want all that fancy animations? Then this is exactly what you need. Use `aa-datepicker` to implement in your component

## "Advanced" Usage

### Control the datepicker programmatically 
You can also control the datepicker programmatically from within your component by using `ViewChild()`. Like so:

```ts
 @ViewChild('demoDatepicker') demoDatepicker: AnimatepickerComponent;

 close(){
  this.demoDatepicker.close();
 }

 open(){
  this.demoDatepicker.open();
 }
 
 next(){
  this.demoDatepicker.goToNextMonth();
 }

 previous(){
  this.demoDatepicker.goToPreviousMonth();
 }
```

And in your template:

```html
<aa-animatepicker #demoDatepicker></aa-animatepicker>
```

### Include your component in the datepicker
Implement you custom component into the datepicker by using the `ng-content` located on the bottom of the datepicker

```html
<aa-animatepicker #demoDatepicker>
    <app-custom-component></app-custom-component>
</aa-animatepicker>
```