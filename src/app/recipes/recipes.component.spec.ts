import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipesComponent } from './recipes.component';
import { AppTestingModule } from '../app.testing.module';

describe('RecipesComponent', () => {
	let component: RecipesComponent;
	let fixture: ComponentFixture<RecipesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppTestingModule]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RecipesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
