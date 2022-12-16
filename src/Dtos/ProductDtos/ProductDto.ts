import {ProductType} from "../../Enums/ProductType";
import {ProductPopularity} from "../../Enums/ProductPopularity";
import {ShopSpecificDto} from "../ShopSpecificDtos/ShopSpecificDto";

export interface ProductDto
{
  id: number;
  productType: ProductType;
  cataloguePrice: number;
  productReference: string;
  ean13: string;
  manufacturerId: number;
  popularity: ProductPopularity;
  imageLink: string;
  shopSpecifics: ShopSpecificDto[];
}
