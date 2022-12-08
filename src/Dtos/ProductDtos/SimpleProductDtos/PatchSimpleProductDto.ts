import {PatchProductDto} from "../PatchProductDto";
import {NullablePropertyWrapperDto} from "../../NullablePropertyWrapperDto";
import {Availability} from "../../../Enums/Availability";

export interface PatchSimpleProductDto extends PatchProductDto
{
  supplierReference?: string;
  pureReference?: string;
  cataloguePrice?: number;
  selectedDiscountId?: NullablePropertyWrapperDto<number>;
  manufacturerCategoryId?: NullablePropertyWrapperDto<number>;
  dee?: number;
  stock?: number;
  averageStockPrice?: number;
  availability?: Availability;
  hasClawOption?: boolean;
}
