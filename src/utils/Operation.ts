import {IChanges} from "../Interfaces/IChanges";

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
    return Object.keys(obj).length;
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

  // keep is a list of properties that should not be compared
  // should be keep in the diff
  // shouldn't be counted in the diff
  static detectChanges(obj: any, initialObj: any, keep: string[] = []): IChanges
  {

    if (Operation.isPrimitive(obj))
    {
      if (obj !== initialObj)
        return {diffObj: obj, count: 1};

      return {diffObj: undefined, count: 0};
    }


    if (Array.isArray(obj)) // array are either equal or not
    {
      // Not the same length means the array has changed
      if (obj.length !== initialObj.length)
        return {diffObj: obj, count: 1};

      // sort the arrays
      let sortedObj = obj.sort();
      let sortedInitialObj = initialObj.sort();

      for (let i = 0; i < obj.length; i++)
      {
        const changes = this.detectChanges(sortedObj[i], sortedInitialObj[i], keep);
        if (changes.count > 0)
          return {diffObj: obj, count: 1};
      }

      return {diffObj: undefined, count: 0};
    }

    let count = 0;
    let diffObj: any = {};
    // if obj is an object
    for (const key in obj)
    {
      if (keep.includes(key))
      {
        diffObj[key] = obj[key];
        continue;
      }

      // Composed object
      const changes = this.detectChanges(obj[key], initialObj[key], keep);
      count += changes.count;
      if (count > 0)
        diffObj[key] = changes.diffObj;
    }

    return {diffObj: diffObj, count: count};
  }
}
