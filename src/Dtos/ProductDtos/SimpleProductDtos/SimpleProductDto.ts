import {ProductDto} from "../ProductDto";
import {Availability} from "../../../Enums/Availability";

export interface SimpleProductDto extends ProductDto
{
  supplierReference: string;
  pureReference: string;
  cataloguePrice: number;
  selectedDiscountId: number;
  manufacturerCategoryId: number;
  deee: number;
  stock: number;
  averageStockPrice: number;
  availability: Availability;
  hasClawOption: boolean;
}
