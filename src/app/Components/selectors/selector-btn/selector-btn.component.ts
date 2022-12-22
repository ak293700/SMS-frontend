import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
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

  // The current state of the button
  @Input() state: string = '';
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();

  // @ts-ignore
  @ViewChild('button') button: ElementRef;

  private index: number = 0;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void
  {
    this.index = this.states.findIndex(x => x == this.state);
  }

  onClick()
  {
    this.index = Operation.modulo(this.index + 1, this.states.length);

    // if rotate is set we remove it
    if (this.button.nativeElement.classList.contains('rotate'))
      this.button.nativeElement.classList.remove('rotate');

    void this.button.nativeElement.offsetWidth; // force a reflow
    this.button.nativeElement.classList.toggle('rotate');

    // the transition time is 500
    // at the half (when we don't see the text) we change the text
    let tmp = '';
    for (let i = 0; i < this.state.length; i++)
      tmp += '&#160;&#160;'; // * 2 because else it is two small

    // it's allow to keep the length while hiding but not seing the text
    setTimeout(() => {
      this.state = tmp;
    }, 200);
    setTimeout(() => {
      this.state = this.states[this.index]
    }, 600);


    this.stateChange.emit(this.state);
  }
}
