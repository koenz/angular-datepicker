import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class DatepickerService {
	public selectedDates: EventEmitter<Date[]> = new EventEmitter();

	setSelectedDated(date: Date[]){
		console.log('service', date);
		this.selectedDates.emit(date);
	}
}