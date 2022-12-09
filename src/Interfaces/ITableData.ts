import {StringEnumerableInterface} from "./StringEnumerableInterface";

export interface ITableData extends StringEnumerableInterface
{
  value: any;
  tooltip?: string;
}

export namespace ITableData
{
  export function is(value: any): value is ITableData
  {
    return value && value.value !== undefined;
  }

  // take an object and wrap it into a ITableData
  export function build(value: any): ITableData
  {
    return {value: value};
  }
}
