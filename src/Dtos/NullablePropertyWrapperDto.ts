import {StringEnumerableInterface} from "../Interfaces/StringEnumerableInterface";

export interface NullablePropertyWrapperDto<T>
{
  value: T;
}

export namespace NullablePropertyWrapperDto
{
  export function build<T>(value: T): NullablePropertyWrapperDto<T>
  {
    return {value};
  }

  // replace the given value by a NullablePropertyWrapperDto if it is not undefined
  export function replace<T extends StringEnumerableInterface>(obj: T, properties: string[]): T
  {
    for (const property of properties)
    {
      if (obj[property] !== undefined) // @ts-ignore
        obj[property] = {value: obj[property]};
    }

    return obj;
  }
}
