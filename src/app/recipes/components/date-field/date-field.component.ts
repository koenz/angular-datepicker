import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent implements OnInit {

  @Input() isRange = false;
  @Input() selectedDates = null;
  @Input() isOpen = false;
  @Output() onFocus = new EventEmitter();
  
  private _selectedRange: string;
	@Output() selectedRangeChange = new EventEmitter();
  @Input()
  get selectedRange() {
    return this._selectedRange
  }

	set selectedRange(value: string) {
    this._selectedRange = value
    this.selectedRangeChange.emit(value)
  }

  constructor() { }

  focus() {
    if(!this.isOpen) {
      this.onFocus.emit()
    }
  }

  ngOnInit() {}
}
