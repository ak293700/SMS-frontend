import {ProductPopularity} from "../../Enums/ProductPopularity";
import {StringEnumerableInterface} from "../../Interfaces/StringEnumerableInterface";

export interface PatchProductDto extends StringEnumerableInterface
{
  id: number;
  productReference?: string;
  ean13?: string;
  manufacturerId?: number;
  popularity?: ProductPopularity;
  imageLink?: string;
}
