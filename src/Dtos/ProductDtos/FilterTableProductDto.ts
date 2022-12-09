import {ProductPopularity} from "../../Enums/ProductPopularity";
import {ProductType} from "../../Enums/ProductType";
import {FilterTableShopSpecificDto} from "../ShopSpecificDtos/FilterTableShopSpecificDto";
import {IEnumerableByString} from "../../Interfaces/IEnumerableByString";

export interface FilterTableProductDto extends IEnumerableByString
{
  id: number;
  productType: ProductType;
  productReference: string;
  purchasePrice: number;
  photo: string;
  manufacturer: string;
  manufacturerFamily: string;
  popularity: ProductPopularity;
  shopSpecifics: FilterTableShopSpecificDto[];
}
