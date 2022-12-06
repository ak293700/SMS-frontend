import {Pipe, PipeTransform} from '@angular/core';
import {FieldType} from "../Enums/FieldType";
import {HeaderDto} from "../Dtos/HeaderDto";

@Pipe({
  name: 'prettier'
})
export class PrettierPipe implements PipeTransform
{

  transform(value: unknown, header: HeaderDto): unknown
  {
    if (value == null)
      return `Pas de ${header.label}`;

    if (typeof value === 'number')
      value = value.toFixed(2);
    else if (typeof value === 'boolean')
      value = value ? 'Oui' : 'Non';

    switch (header.type)
    {
      case FieldType.Currency:
        value = value + '€';
        break;
      case FieldType.Percentage: // @ts-ignore
        value = `${(value * 100).toFixed()}%`;
        break;
      default:
        break;
    }

    return value + header.suffix;
  }

}
