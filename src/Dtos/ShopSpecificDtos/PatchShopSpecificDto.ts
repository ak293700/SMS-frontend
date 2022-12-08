import {StringEnumerableInterface} from "../../Interfaces/StringEnumerableInterface";
import {NullablePropertyWrapperDto} from "../NullablePropertyWrapperDto";
import {PatchDto} from "../../Interfaces/PatchDto";

export interface PatchShopSpecificDto extends StringEnumerableInterface
{
  id: number;
  name?: string;
  idPrestashop?: NullablePropertyWrapperDto<number>;
  km?: number;
  promotion?: number;
  active?: boolean;
}

export namespace PatchShopSpecificDto
{
  export const NullablePropertyWrapperDtoProperties: string[] = ['idPrestashop'];

  export function build<T extends StringEnumerableInterface>(obj: any): T
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
