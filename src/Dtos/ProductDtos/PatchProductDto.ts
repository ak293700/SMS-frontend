import {ProductPopularity} from "../../Enums/ProductPopularity";

export interface PatchProductDto
{
  id: number;
  productReference?: string;
  ean13?: string;
  manufacturerId?: number;
  popularity?: ProductPopularity;
  imageLink?: string;
}
