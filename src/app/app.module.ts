import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DemoComponent} from './demo/demo.component';
import {AaDatepickerModule} from 'ngx-animating-datepicker';
import { RouterModule, Routes} from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { AppComponent } from './app.component';
import { DateFieldComponent } from './date-field/date-field.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'demo', pathMatch: 'full' },
	{ path: 'demo', component: DemoComponent},
	{ path: 'demo', component: DemoComponent },
	{ path: 'recipes', component: RecipesComponent },
]
@NgModule({
	imports: [
		RouterModule.forRoot(
			appRoutes,
			// { enableTracing: true } // <-- debugging purposes only
		),
		BrowserModule,
		BrowserAnimationsModule,
		AaDatepickerModule, 
		ReactiveFormsModule
	],
	declarations: [AppComponent, DemoComponent, RecipesComponent, DateFieldComponent],
	bootstrap: [AppComponent],
	entryComponents: [AppComponent]
})
export class AppModule {
}
