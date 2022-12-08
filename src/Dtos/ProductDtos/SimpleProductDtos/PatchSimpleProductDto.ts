import {PatchProductDto} from "../PatchProductDto";
import {NullablePropertyWrapperDto} from "../../NullablePropertyWrapperDto";
import {Availability} from "../../../Enums/Availability";
import {PatchDto} from "../../../Interfaces/PatchDto";

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

export namespace PatchSimpleProductDto
{
  const NullablePropertyWrapperDtoProperties: string[] = ["selectedDiscountId", "manufacturerCategoryId"];

  export function build(obj: any): PatchSimpleProductDto
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
