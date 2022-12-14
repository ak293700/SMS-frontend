import {DiscountType} from "../../Enums/DiscountType";

export interface LiteDiscountDto
{
  id: number;
  discountType: DiscountType;
  value: number;
  isNetPrice: boolean;
  quantity?: number;
  productsInUseReference: string[];
}
