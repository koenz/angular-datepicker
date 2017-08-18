import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Output() onPreviousClick: EventEmitter<null> = new EventEmitter();
  @Output() onNextClick: EventEmitter<null> = new EventEmitter();

  @Input() public date: Date;

  constructor() { }

  ngOnInit() { 
  }

  previous(){
    this.onPreviousClick.emit();
  }

  next(){
    this.onNextClick.emit();
  }

}
