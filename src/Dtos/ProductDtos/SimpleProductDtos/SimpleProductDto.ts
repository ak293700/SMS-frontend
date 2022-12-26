import {ProductDto} from "../ProductDto";
import {Availability} from "../../../Enums/Availability";
import {LiteDiscountDto} from "../../DiscountDtos/LIteDiscountDto";

export interface SimpleProductDto extends ProductDto
{
  discount?: LiteDiscountDto;
  supplierReference: string;
  pureReference: string;
  selectedDiscountId: number | null;
  manufacturerCategoryId: number;
  stock: number;
  averageStockPrice: number;
  availability: Availability;
  hasClawOption: boolean;
}
