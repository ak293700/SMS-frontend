import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'prettier'
})
export class PrettierPipe implements PipeTransform
{

  transform(value: unknown): unknown
  {
    if (typeof value === 'number')
      return value.toLocaleString('fr-FR', {maximumFractionDigits: 2});

    return value;
  }

}
