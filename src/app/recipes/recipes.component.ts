import { Component, OnInit } from '@angular/core';
import { DefaultOptions } from '../../../projects/ngx-animating-datepicker/src/lib/components/datepicker/datepicker.options';
import { Options } from 'ngx-animating-datepicker';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  public optionsGoogle: Options = {...DefaultOptions, range: true, hideRestDays: true, hideNavigation: true};
  public isRange = true;
  public isOpen = false;

  constructor() { }

  ngOnInit() {
  }

  onTicketTypeSelect({target}) {
    this.isRange = ticketTypeObj[target.value];
    this.optionsGoogle = {
      ...this.optionsGoogle, 
      range: this.isRange}
  }
}

const ticketTypeObj = {
  return: true,
  oneway: false
}
