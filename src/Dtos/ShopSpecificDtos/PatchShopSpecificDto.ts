import {IEnumerableByString} from "../../Interfaces/IEnumerableByString";
import {NullablePropertyWrapperDto} from "../NullablePropertyWrapperDto";
import {PatchDto} from "../../Interfaces/PatchDto";

export interface PatchShopSpecificDto extends IEnumerableByString
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

  export function build(obj: any): PatchShopSpecificDto
  {
    return PatchDto.build(obj, NullablePropertyWrapperDtoProperties);
  }
}
