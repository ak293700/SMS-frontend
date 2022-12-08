import {IdNameDto} from "../Dtos/IdNameDto";

export enum ProductPopularity
{
  Level0 = 0,
  Level1,
  Level2,
  Level3,
  Level4
}

export namespace ProductPopularity
{
  export function toString(popularity: ProductPopularity): string
  {
    return ProductPopularity[popularity].toString();
  }

  export function toIdNameDto(): IdNameDto[]
  {
    const res: IdNameDto[] = [];
    const values = Object.values(ProductPopularity);
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
