import {IEnumerableByString} from "./IEnumerableByString";

export interface ITableData extends IEnumerableByString
{
  value: any;
  tooltip?: string;
}

export namespace ITableData
{
  // take an object and wrap it into a ITableData
  export function build(value: any, tooltip: string = ''): ITableData
  {
    return {value: value, tooltip: tooltip ?? ''};
  }
}

export interface IEnumerableToITableData
{
  [prop: string]: ITableData;
}
