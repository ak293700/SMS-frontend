import {ProductDto} from "../ProductDto";
import {LiteBundleItemDto} from "./BundleItemDto/LiteBundleItemDto";

export interface BundleDto extends ProductDto
{
  items: LiteBundleItemDto[];
}
