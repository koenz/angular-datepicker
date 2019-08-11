import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { DefaultOptions } from '../../../../../projects/ngx-animating-datepicker/src/lib/components/datepicker/datepicker.options';
import { Options, AnimatepickerComponent } from 'ngx-animating-datepicker';

@Component({
  selector: 'app-google-flights',
  templateUrl: './google-flights.component.html',
  styleUrls: ['./google-flights.component.scss']
})
export class GoogleFlightsComponent implements OnInit {

  public optionsGoogle: Options = {...DefaultOptions, range: true, hideRestDays: true, hideNavigation: true};
  public isRange = true;
  public isOpen = false;
  @ViewChild('googleDatepicker') datepicker: AnimatepickerComponent;

	clickListener;



  constructor(
    private renderer: Renderer2,
    public element: ElementRef
  ) { }

  ngOnInit() {
    
  }

  /**
	 * Handles the (faked) blur event
	 *
	 * @param event
	 */
  
   onBlurHandler(event: Event): void {
    // TODO: add on blur @output to datepicker maybe
		if (
      event.target !== this.element.nativeElement &&
      !this.element.nativeElement.contains(event.target) &&
			event.target !== this.datepicker.element.nativeElement &&
			!this.datepicker.element.nativeElement.contains(event.target)
		) {      
			// check click origin
			this.datepicker.close();
		}
	}

  onTicketTypeSelect({target}) {
    this.isRange = ticketTypeObj[target.value];
    this.optionsGoogle = {
      ...this.optionsGoogle, 
      range: this.isRange}
  }

  openDatepicker() {
    this.datepicker.open();
  }

  onOpen(e) {
    console.log('bem', e);
    this.isOpen = true;
    this.clickListener = this.renderer.listen('document', 'click', this.onBlurHandler.bind(this));
  }

  onClose() {
    this.clickListener.destroy();
  }
}

const ticketTypeObj = {
  return: true,
  oneway: false
}

