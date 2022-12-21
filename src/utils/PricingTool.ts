export class PricingTool
{
  static calculateMarginRate(salePriceEt: number, purchasePrice: number)
  {
    return (salePriceEt - purchasePrice) / salePriceEt;
  }

  static calculateSalePriceEt(purchasePrice: number, km: number, promotion: number, deee: number = 0)
  {
    return purchasePrice * km * (1 - promotion) + deee;
  }

  static calculateSalePriceIt(purchasePrice: number, km: number, promotion: number, deee: number = 0)
  {
    return this.calculateSalePriceEt(purchasePrice, km, promotion, deee) * 1.2;
  }
}
