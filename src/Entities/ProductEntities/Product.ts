import {ProductType} from "../../Enums/ProductType";
import {ProductPopularity} from "../../Enums/ProductPopularity";

export interface Product
{
  id: number;
  productType: ProductType;
  productReference: string;
  ean13: string;
  manufacturerId: number;
  shopSpecificsId: number[];
  popularity: ProductPopularity;
  imageLink: string;

  manufacturer: any;
  shopSpecifics: any[];
}
