import {PatchProductDto} from "../PatchProductDto";
import {PatchDto} from "../../../Interfaces/PatchDto";

export interface PatchBundleDto extends PatchProductDto
{

}

export namespace PatchBundleDto
{
  export function build(obj: any): PatchBundleDto
  {
    return PatchDto.build(obj, []);
  }
}
