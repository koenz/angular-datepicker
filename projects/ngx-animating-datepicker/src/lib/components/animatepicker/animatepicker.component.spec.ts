import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimatepickerComponent } from './animatepicker.component';
import { AaDatepickerModule } from '../../ngx-animating-datepicker.module';

describe('AnimatepickerComponent', () => {
	let component: AnimatepickerComponent;
	let fixture: ComponentFixture<AnimatepickerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AaDatepickerModule]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AnimatepickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
