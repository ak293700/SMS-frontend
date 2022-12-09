import {Pipe, PipeTransform} from '@angular/core';
import {FieldType} from "../../Enums/FieldType";
import {IHeader} from "../../Dtos/IHeader";

@Pipe({
  name: 'prettier'
})
export class PrettierPipe implements PipeTransform
{

  transform(value: any, header: IHeader): unknown
  {
    if (value == null)
      return `Pas de ${header.label}`;

    switch (header.type)
    {
      case FieldType.Currency:
        value = value + '€';
        break;
      case FieldType.Percentage: // @ts-ignore
        value = `${(value * 100).toFixed()}%`;
        break;
      case FieldType.Integer:
        value = (value as number).toFixed();
        break
      default:
        break;
    }

    if (typeof value === 'number')
      value = value.toFixed(2);
    else if (typeof value === 'boolean')
      value = value ? 'Oui' : 'Non';

    return value + (header.suffix ?? '');
  }
}
