import {Shop} from "../../Enums/Shop";

export interface ShopSpecificDto
{
  id: number;
  name: string;
  idPrestaShop: number | null;
  shop: Shop;
  km: number;
  promotion: number;
  active: boolean;
  categoriesId: number[];
}
