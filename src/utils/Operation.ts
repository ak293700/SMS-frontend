import {IdNameDto} from "../Dtos/IdNameDto";

export class Operation
{
  static deepCopy<T>(x: T): T
  {
    if (Operation.isPrimitive(x))
      return x;

    if (Array.isArray(x))
    {
      let res = [];
      for (const value of x)
        res.push(Operation.deepCopy(value));

      // @ts-ignore
      return res;
    }

    let res: any = {};
    for (const key in x)
      res[key] = this.deepCopy(x[key]);

    return res;
  }

  static isPrimitive(x: any): boolean
  {
    return (typeof x !== "object" || x === null);
  }

  // arithmetical modulo
  static modulo(a: number, b: number): number
  {
    return ((a % b) + b) % b;
  }

  static countProperties(obj: any): number
  {
    return Object.values(obj).filter(key => key !== undefined).length;
  }

  static firstOrDefault<T>(array: T[], predicate: (value: T) => boolean = () => true)
    : T | undefined
  {
    for (const value of array)
      if (predicate(value))
        return value;
    return undefined;
  }

  static first<T>(array: T[], predicate: (value: T) => boolean = () => true)
    : T
  {
    for (const value of array)
      if (predicate(value))
        return value;
    // @ts-ignore
    return undefined;
  }

  static toIdNameDto(e: any): IdNameDto[]
  {
    const res: IdNameDto[] = [];
    const values = Object.values(e);
    for (let i = 0; i < values.length; i++)
    {
      const value = values[i];
      if (typeof value !== 'string')
        break

      res.push({id: i, name: value});
    }

    return res;
  }

  // filter either with the name or with the id
  static completeMethod(value: string, list: IdNameDto[], checkId: boolean = true): IdNameDto[]
  {
    value = value.toLowerCase();
    const number: number = checkId ? Number(value) : NaN;
    return list
      .filter((obj: IdNameDto) => obj.id === number || obj.name.toLowerCase().includes(value));
  }

  static deepMerge(objs: any[]): any
  {
    if (objs.length === 0)
      return {};

    let diff: any = Operation.deepCopy(objs[0]);
    for (let i = 1; i < objs.length; i++)
      diff = this._deepMerge(diff, objs[i]);

    return diff;
  }

  private static _deepMerge(first: any, second: any): any
  {
    if (first == undefined)
      return second;

    if (second === undefined)
      return first;

    if (typeof first !== typeof second)
      throw new Error("Cannot merge two different types");

    if (Array.isArray(first))
      return first.concat(second);

    let res: any = {};
    // get the key of the two objects
    let keys = Object.keys(first).concat(Object.keys(second));
    keys = keys.filter((key, index) => keys.indexOf(key) === index)

    for (const key of keys)
      res[key] = this._deepMerge(first[key], second[key]);

    return res;
  }
}
