import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UtilitiesService } from 'app/services/utilities.service.';
import { AnimatepickerComponent } from './components/animatepicker/animatepicker.component';
import { DatepickerDirective } from './components/datepicker/datepicker.directive';
import { DatepickerService } from './components/datepicker/datepicker.service.';

@NgModule({
	declarations: [
		DatepickerComponent,
		NavigationComponent,
		AnimatepickerComponent,
		DatepickerDirective
	],
	imports: [
		BrowserModule
	],
	providers: [
		UtilitiesService,
		DatepickerService
	],
	exports: [
		DatepickerComponent,
		NavigationComponent,
		AnimatepickerComponent,
		DatepickerDirective,
	],
	entryComponents: [ DatepickerComponent ]
})
export class DatepickerModule {
}
