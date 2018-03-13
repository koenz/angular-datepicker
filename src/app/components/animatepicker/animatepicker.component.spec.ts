import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatePickerComponent } from './animate-picker.component';

describe('AnimatePickerComponent', () => {
  let component: AnimatePickerComponent;
  let fixture: ComponentFixture<AnimatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
