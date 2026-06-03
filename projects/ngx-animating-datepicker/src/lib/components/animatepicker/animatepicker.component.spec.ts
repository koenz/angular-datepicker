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

	it('should emit navigate when the visible month changes', () => {
		const navigateSpy = vi.spyOn(component.navigate, 'emit');
		component.goToDate(new Date(2024, 0, 1));
		expect(navigateSpy).toHaveBeenCalledWith([{ year: 2024, month: 0 }]);

		navigateSpy.mockClear();
		component.goToNextMonth();
		expect(navigateSpy).toHaveBeenCalledWith([{ year: 2024, month: 1 }]);
	});
});
