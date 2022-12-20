import {IdNameDto} from "../Dtos/IdNameDto";

export enum DiscountType
{
  None = 0,
  Distributor,
  Derogation
}

export namespace DiscountType
{
  export function toString(discountType: DiscountType): string
  {
    switch (discountType)
    {
      case DiscountType.None:
        return "Aucun";
      case DiscountType.Distributor:
        return "Distributeur";
      case DiscountType.Derogation:
        return "Dérogation";
    }
  }

  export function toIdNameDto(): IdNameDto[]
  {
    return [
      {id: DiscountType.Distributor, name: DiscountType.toString(DiscountType.Distributor)},
      {id: DiscountType.Derogation, name: DiscountType.toString(DiscountType.Derogation)},
    ]
  }
}
