import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'prettier'
})
export class PrettierPipe implements PipeTransform
{

  transform(value: unknown): unknown
  {
    if (typeof value === 'number')
      return value.toFixed(2);

    return value;
  }

}
