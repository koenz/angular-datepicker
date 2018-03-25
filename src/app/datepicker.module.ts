import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UtilitiesService } from 'app/services/utilities.service';
import { AnimatepickerComponent } from './components/animatepicker/animatepicker.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DatepickerDirective } from './components/datepicker/datepicker.directive';
import { NavigationComponent } from './components/navigation/navigation.component';

@NgModule({
	declarations: [DatepickerComponent, NavigationComponent, AnimatepickerComponent, DatepickerDirective],
	imports: [BrowserModule],
	providers: [UtilitiesService],
	exports: [DatepickerComponent, NavigationComponent, AnimatepickerComponent, DatepickerDirective],
	entryComponents: [DatepickerComponent, AnimatepickerComponent]
})
export class AaDatepickerModule { }
