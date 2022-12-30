import {Shop} from "../../Enums/Shop";

export interface FilterTableShopSpecificDto
{
  name: string;
  idPrestashop?: number;
  shop: Shop;
  promotion: number;
  salePriceIt: number;
  active: boolean;
  mainCategory?: string;
}
