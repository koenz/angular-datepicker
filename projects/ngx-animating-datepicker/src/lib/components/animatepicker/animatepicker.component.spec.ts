import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilitiesService } from '../../services/utilities.service';
import { NavigationComponent } from '../navigation/navigation.component';
import { AnimatepickerComponent } from './animatepicker.component';

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
