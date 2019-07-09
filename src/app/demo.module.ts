import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {DemoComponent} from './demo/demo.component';
import {AaDatepickerModule} from 'ngx-animating-datepicker';

@NgModule({
	imports: [BrowserModule, AaDatepickerModule, ReactiveFormsModule],
	declarations: [DemoComponent],
	bootstrap: [DemoComponent],
	entryComponents: [DemoComponent]
})
export class DemoModule {
}
