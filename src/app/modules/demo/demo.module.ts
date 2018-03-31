import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AaDatepickerModule } from 'app/datepicker.module';
import { DemoComponent } from './demo/demo.component';

@NgModule({
	imports: [BrowserModule, AaDatepickerModule, ReactiveFormsModule],
	declarations: [DemoComponent],
	bootstrap: [DemoComponent],
	entryComponents: [DemoComponent]
})
export class DemoModule {}
