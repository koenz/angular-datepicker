import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthpickerComponent } from './monthpicker.component';

describe('MonthpickerComponent', () => {
	let component: MonthpickerComponent;
	let fixture: ComponentFixture<MonthpickerComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [MonthpickerComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(MonthpickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
