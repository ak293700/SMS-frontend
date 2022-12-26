import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operation} from "../../../../utils/Operation";

@Component({
  selector: 'app-selector-btn',
  templateUrl: './selector-btn.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    './selector-btn.component.css'
  ]
})
export class SelectorBtnComponent implements OnInit
{
  // All the possible states of the button
  @Input() states: string[] = [];

  // The index state of the button
  @Input() index: number = 0;
  @Output() indexChange: EventEmitter<number> = new EventEmitter<number>();

  // the current state of the button
  state: string = '';

  // @ts-ignore
  @ViewChild('button') button: ElementRef;


  constructor() { }

  ngOnInit(): void
  {
    this.state = this.states[this.index];
  }

  onClick()
  {
    // if rotate is set we exit
    if (this.button.nativeElement.classList.contains('rotate'))
      return;

    this.index = Operation.modulo(this.index + 1, this.states.length);

    void this.button.nativeElement.offsetWidth; // force a reflow
    this.button.nativeElement.classList.toggle('rotate');

    // the transition time is 500
    // at the half (when we don't see the text) we change the text
    let tmp = '';
    for (let i = 0; i < this.state.length; i++)
      tmp += '&#160;&#160;'; // * 2 because else it is two small

    // it's allow to keep the length while hiding but not seing the text
    setTimeout(() => { // wait the transition to set the fake text (so we don't see it)
      this.state = tmp;
    }, 200);
    setTimeout(() => { // wait the transition to set the real text (so we see it appear)
      this.state = this.states[this.index];
      this.indexChange.emit(this.index);
    }, 600);
    setTimeout(() => { // wait the end to remove the class
      this.button.nativeElement.classList.remove('rotate');
    }, 800);
  }
}
