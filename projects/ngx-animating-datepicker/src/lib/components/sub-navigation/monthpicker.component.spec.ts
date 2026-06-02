import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SubNavigationComponent } from './sub-navigation.component';

describe('SubNavigationComponent', () => {
	let component: SubNavigationComponent;
	let fixture: ComponentFixture<SubNavigationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubNavigationComponent],
			imports: [CommonModule]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubNavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
