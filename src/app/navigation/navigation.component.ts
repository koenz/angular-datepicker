import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

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
  @Input() private date: Date;
  @Input() public numberOfMonths: Number[];

  private formatMonth = new Intl.DateTimeFormat(this.language, { month: this.monthFormat });
  public titleMomnth: string = this.formatMonth.format(this.date);
  public titleYear: number;

  ngOnInit() { 
    this.titleYear = this.date.getFullYear();
  }

  ngOnChanges(changes: SimpleChanges){
    if(!changes.date.firstChange){
      this.titleYear = this.date.getFullYear();
      this.titleMomnth = this.formatMonth.format(this.date);
    }
  }

  previous(): void {
    this.onPreviousClick.emit();
  }

  next(): void {
    this.onNextClick.emit();
  }

}
