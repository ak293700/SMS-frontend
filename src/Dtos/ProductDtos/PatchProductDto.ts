import {ProductPopularity} from "../../Enums/ProductPopularity";
import {IEnumerableByString} from "../../Interfaces/IEnumerableByString";

export interface PatchProductDto extends IEnumerableByString
{
  id: number;
  productReference?: string;
  ean13?: string;
  manufacturerId?: number;
  popularity?: ProductPopularity;
  imageLink?: string;
}
