import { Component, OnInit } from '@angular/core';
import { DefaultOptions } from '../../../projects/ngx-animating-datepicker/src/lib/components/datepicker/datepicker.options';

@Component({
  selector: 'app-recipes',
  standalone: false,
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  public animateOptionsGoogle = {...DefaultOptions, hideRestDays: true, hideNavigation: true};
  public selectedDatesAnimate: Date[] = [];

  constructor() { }

  ngOnInit() {
  }

}
