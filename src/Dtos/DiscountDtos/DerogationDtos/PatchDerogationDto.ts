import {PatchDiscountDto} from "../PatchDiscountDto";
import {PatchDto} from "../../../Interfaces/PatchDto";

export interface PatchDerogationDto extends PatchDiscountDto
{
  manufacturerId?: number;
  distributorIds?: number[];
}

export namespace PatchDerogationDto
{
  const NullablePropertyWrapperDtoProperties: string[] = PatchDiscountDto.NullablePropertyWrapperDtoProperties
    .concat([]);

  export function build(obj: any): PatchDerogationDto
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
