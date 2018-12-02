import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReactiveFormsModule} from '@angular/forms';
import {AaDatepickerModule} from 'ngx-animating-datepicker';
import {DemoComponent} from './demo.component';

describe('DemoComponent', () => {
	let component: DemoComponent;
	let fixture: ComponentFixture<DemoComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [DemoComponent],
				imports: [AaDatepickerModule, ReactiveFormsModule]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DemoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
