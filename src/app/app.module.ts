import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { NavigationComponent } from './navigation/navigation.component';
import { UtilitiesService } from 'app/common/services/utilities.service.';
import { AnimatepickerComponent } from './extentions/animatepicker/animatepicker.component';

@NgModule({
	declarations: [
		AppComponent,
		DatepickerComponent,
		NavigationComponent,
		AnimatepickerComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule
	],
	providers: [
		UtilitiesService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
