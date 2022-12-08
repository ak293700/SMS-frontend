export enum ProductType
{
  None = 0,
  Simple = 1,
  Bundle = 2,
}

export namespace ProductType
{
  export function toString(productType: ProductType): string
  {
    return ProductType[productType].toString();
  }
}
