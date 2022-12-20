import {CreateProductDto} from "../CreateProductDto";
import {CreateBundleItemDto} from "./BundleItemDto/CreateBundleItemDto";

export interface CreateBundleDto extends CreateProductDto
{
  bundleItems: CreateBundleItemDto[];
}
