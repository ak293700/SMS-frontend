export class Operation
{
  static deepCopy(x: any): any
  {
    if (Operation.isPrimitive(x))
      return x;

    if (Array.isArray(x))
    {
      let res = [];
      for (const value of x)
        res.push(Operation.deepCopy(value));

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
}
