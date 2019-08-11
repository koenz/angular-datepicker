import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleFlightsComponent } from './google-flights.component';

describe('GoogleFlightsComponent', () => {
  let component: GoogleFlightsComponent;
  let fixture: ComponentFixture<GoogleFlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleFlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
