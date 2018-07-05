import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../../services/utilities.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { DatepickerComponent } from './datepicker.component';

describe('DatepickerComponent', () => {
	let component: DatepickerComponent;
	let fixture: ComponentFixture<DatepickerComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [DatepickerComponent, NavigationComponent],
				providers: [UtilitiesService]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(DatepickerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
