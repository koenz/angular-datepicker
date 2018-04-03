import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatepickerComponent } from './animatepicker.component';

describe('AnimatePickerComponent', () => {
	let component: AnimatepickerComponent;
	let fixture: ComponentFixture<AnimatepickerComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [AnimatepickerComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(AnimatepickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
