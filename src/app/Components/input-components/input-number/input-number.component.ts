import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {InputNumberMode} from "./InputNumberMode";

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css']
})
export class InputNumberComponent implements OnChanges
{
  @Input() value: number = 0;
  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  _value: number = 0;

  // The type of value to display
  @Input() mode: string = InputNumberMode.Decimal;
  // The mode translate to a string
  _mode: string = 'decimal';

  step: number = 0.01;

  @Input() placeholder: string = '';

  suffix: string = '';

  ngOnChanges(changes: SimpleChanges): void
  {
    this._mode = InputNumberMode.Decimal;
    this.suffix = '';

    if (this.mode == InputNumberMode.Currency)
      this._mode = InputNumberMode.Currency;
    else if (this.mode == InputNumberMode.Percent)
      this.suffix = '%';

    this.fromUserValue();
  }

  // set _value accordingly to value
  toUserValue()
  {
    if (this.mode == InputNumberMode.Percent)
      this.value = this._value / 100;
    else
      this.value = this._value;
  }

  // set value accordingly to _value
  fromUserValue()
  {
    if (this.mode == InputNumberMode.Percent)
      this._value = this.value * 100;
    else
      this._value = this.value;
  }

  valueOnChange(newValue: any)
  {
    this._value = newValue;

    this.toUserValue();
    this.valueChange.emit(this.value);
  }

}
