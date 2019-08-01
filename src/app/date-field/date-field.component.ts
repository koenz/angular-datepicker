import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss']
})
export class DateFieldComponent implements OnInit {

  @Input() isRange = false;
  @Input() selectedDates = null;
  
  _isOpen = false;
  @Output() isOpenChange = new EventEmitter();
  @Input()
  get isOpen() {
    return this._isOpen
  }

	set isOpen(value: boolean) {
    this._isOpen = value
    this.isOpenChange.emit(value)
  }

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

  open() {
    if(!this.isOpen) {
      this.isOpen = true;
    }
  }

  ngOnInit() {}
}
