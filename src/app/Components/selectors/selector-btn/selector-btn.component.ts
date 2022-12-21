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

  // The current state of the button
  @Input() state: string = '';
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();

  // @ts-ignore
  @ViewChild('button') button: ElementRef;

  private index: number = 0;

  ngOnInit(): void
  {
    this.index = this.states.findIndex(x => x == this.state);
  }

  onClick()
  {
    this.index = Operation.modulo(this.index + 1, this.states.length);
    this.state = this.states[this.index];

    // if rotate is set we remove it
    if (this.button.nativeElement.classList.contains('rotate'))
      this.button.nativeElement.classList.remove('rotate');

    void this.button.nativeElement.offsetWidth; // force a reflow
    this.button.nativeElement.classList.toggle('rotate');

    this.stateChange.emit(this.state);
  }
}
