import {IEnumerableByString} from "../../Interfaces/IEnumerableByString";
import {NullablePropertyWrapperDto} from "../NullablePropertyWrapperDto";

export interface PatchDiscountDto extends IEnumerableByString
{
  id: number;
  value?: number;
  isNetPrice?: boolean;
  quantity?: NullablePropertyWrapperDto<number>;
}


export namespace PatchDiscountDto
{
  export const NullablePropertyWrapperDtoProperties: string[] = ["quantity"];
}
