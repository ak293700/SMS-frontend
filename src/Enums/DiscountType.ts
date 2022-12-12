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
}
