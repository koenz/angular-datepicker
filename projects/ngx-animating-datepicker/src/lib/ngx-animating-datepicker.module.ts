import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnimatepickerComponent } from './components/animatepicker/animatepicker.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DatepickerDirective } from './components/datepicker/datepicker.directive';
import { SubNavigationComponent } from './components/sub-navigation/sub-navigation.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UtilitiesService } from './services/utilities.service';

@NgModule({
	declarations: [
		DatepickerComponent,
		NavigationComponent,
		AnimatepickerComponent,
		DatepickerDirective,
		SubNavigationComponent
	],
	imports: [CommonModule],
	providers: [UtilitiesService],
	exports: [
		DatepickerComponent,
		NavigationComponent,
		AnimatepickerComponent,
		DatepickerDirective
	],
	entryComponents: [DatepickerComponent, AnimatepickerComponent]
})
export class AaDatepickerModule {}
