import {StringEnumerableInterface} from "./StringEnumerableInterface";
import {NullablePropertyWrapperDto} from "../Dtos/NullablePropertyWrapperDto";

export namespace PatchDto
{
  export function build<T extends StringEnumerableInterface>(obj: any, nullablePropertyWrapperDtoProperties: string[]): T
  {
    // @ts-ignore
    const patch: T = {};

    for (const [key, value] of Object.entries(obj)) // @ts-ignore
      patch[key] = value;

    return NullablePropertyWrapperDto.replace(patch, nullablePropertyWrapperDtoProperties);
  }
}
