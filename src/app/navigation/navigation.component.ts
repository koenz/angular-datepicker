import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnChanges {

  @Output() onPreviousClick: EventEmitter<null> = new EventEmitter();
  @Output() onNextClick: EventEmitter<null> = new EventEmitter();
  
  @Input() private monthFormat: string = 'short' // "narrow", "short", "long";
  @Input() private language: string = navigator.language;
  @Input() private currentMonthYear: Object;

  @HostBinding('class.is-animate') 
  @Input() public animate: boolean;

  private formatMonth = new Intl.DateTimeFormat(this.language, { month: this.monthFormat });
  public titleArray;

  ngOnInit() { 
    this.setTitle(this.currentMonthYear);
  }

  ngOnChanges(changes: SimpleChanges){
    if(!changes.currentMonthYear.firstChange){
      this.setTitle(this.currentMonthYear);
    }
  }

  setTitle(currentMonthYear){
    // TODO: maybe use setter instaed of ngOnchanges
    this.titleArray = currentMonthYear.map(el => {
      let date = new Date(el.year, el.month);
      el.month = this.formatMonth.format(date);
      return el;
    });    
  }

  previous(): void {
    this.onPreviousClick.emit();
  }

  next(): void {
    this.onNextClick.emit();
  }

}
