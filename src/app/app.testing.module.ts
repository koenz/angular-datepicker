import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AaDatepickerModule } from 'ngx-animating-datepicker';
import { DemoComponent } from './demo/demo.component';
import { RecipesComponent } from './recipes/recipes.component';

@NgModule({
	imports: [CommonModule, ReactiveFormsModule, NoopAnimationsModule, AaDatepickerModule],
	declarations: [DemoComponent, RecipesComponent],
	exports: [DemoComponent, RecipesComponent]
})
export class AppTestingModule {}
