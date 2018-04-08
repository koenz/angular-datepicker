import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimatepickerComponent } from './animatepicker.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { UtilitiesService } from '../../services/utilities.service';

describe('AnimatepickerComponent', () => {
	let component: AnimatepickerComponent;
	let fixture: ComponentFixture<AnimatepickerComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [AnimatepickerComponent, NavigationComponent],
				providers: [UtilitiesService]
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
