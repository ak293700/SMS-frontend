import {NullablePropertyWrapperDto} from "../NullablePropertyWrapperDto";
import {ProductPopularity} from "../../Enums/ProductPopularity";
import {RequestWithOperandDto} from "../RequestWithOperandDto";
import {PatchDto} from "../../Interfaces/PatchDto";
import {ShopSpecificMultipleChangesDto} from "../ShopSpecificDtos/ShopSpecificMultipleChangesDto";

export interface ProductMultipleChangesDto
{
  ids: number[];
  popularity?: ProductPopularity;
  manufacturerId?: number;
  selectedDiscountId?: NullablePropertyWrapperDto<number | null>;
  availableDiscounts?: RequestWithOperandDto<number[]>;

  shopSpecific?: ShopSpecificMultipleChangesDto;
}

export namespace ProductMultipleChangesDto
{
  const NullablePropertyWrapperDtoProperties: string[] = ["selectedDiscountId"];

  export function build(obj: any): ProductMultipleChangesDto
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
