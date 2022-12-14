import {PatchDiscountDto} from "../PatchDiscountDto";
import {PatchDto} from "../../../Interfaces/PatchDto";

export interface PatchDistributorDiscountDto extends PatchDiscountDto
{
  distributorsId?: number;
}


export namespace PatchDistributorDiscountDto
{
  const NullablePropertyWrapperDtoProperties: string[] = PatchDiscountDto.NullablePropertyWrapperDtoProperties
    .concat([]);

  export function build(obj: any): PatchDistributorDiscountDto
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
