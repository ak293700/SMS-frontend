import {Shop} from "../../Enums/Shop";

export interface CreateShopSpecificDto
{
  name: string;
  shop: Shop;
  idPrestashop: number | null;
  km: number;
  promotion: number;
}
