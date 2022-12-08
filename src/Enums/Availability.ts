import {IdNameDto} from "../Dtos/IdNameDto";

export enum Availability
{
  H24_48 = 0,
  J7,
  NotAvailable,
  SoldOut
}

export namespace Availability
{
  export function toString(availability: Availability): string
  {
    return Availability[availability].toString();
  }

  export function toIdNameDto(): IdNameDto[]
  {
    const res: IdNameDto[] = [];
    const values = Object.values(Availability);
    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      if (typeof value !== 'string')
        break

      res.push({id: i, name: value});
    }

    return res;
  }
}
