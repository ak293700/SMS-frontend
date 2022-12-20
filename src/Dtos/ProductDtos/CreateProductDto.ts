import {ProductPopularity} from "../../Enums/ProductPopularity";
import {CreateShopSpecificDto} from "../ShopSpecificDtos/CreateShopSpecificDto";

export interface CreateProductDto
{
  productReference: string;
  ean13: string;
  popularity: ProductPopularity;
  manufacturerId: number;
  shopSpecifics: CreateShopSpecificDto[];
}
