import {Shop} from "../../Enums/Shop";

export interface FilterTableShopSpecificDto
{
  name: string;
  idPrestaShop?: number;
  shop: Shop;
  promotion: number;
  salePriceIt: number;
  active: boolean;
  mainCategory?: string;
}
