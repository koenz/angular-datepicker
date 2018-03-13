import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DemoComponent } from './demo/demo.component';
import { DatepickerModule } from "app/datepicker.module"
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
	BrowserModule,
	DatepickerModule,
	ReactiveFormsModule
  ],
  declarations: [DemoComponent],
  bootstrap: [DemoComponent]
})
export class DemoModule { }
