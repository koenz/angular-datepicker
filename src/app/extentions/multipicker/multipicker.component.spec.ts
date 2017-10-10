import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipickerComponent } from './multipicker.component';

describe('MultipickerComponent', () => {
  let component: MultipickerComponent;
  let fixture: ComponentFixture<MultipickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
