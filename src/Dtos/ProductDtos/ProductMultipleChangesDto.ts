import {NullablePropertyWrapperDto} from "../NullablePropertyWrapperDto";
import {ProductPopularity} from "../../Enums/ProductPopularity";
import {RequestWithOperationDto} from "../RequestWithOperationDto";
import {PatchDto} from "../../Interfaces/PatchDto";

export interface ProductMultipleChangesDto
{
  ids: number[];
  popularity?: ProductPopularity;
  manufacturerId?: number;
  selectedDiscountId?: NullablePropertyWrapperDto<number>;
  availableDiscounts?: RequestWithOperationDto<number[]>;
}

export namespace ProductMultipleChangesDto
{
  const NullablePropertyWrapperDtoProperties: string[] = ["selectedDiscountId", "availableDiscounts"];

  export function build(obj: any): ProductMultipleChangesDto
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
