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

  // keep is a list of properties that should not be compared
  // should be keep in the diff
  // shouldn't be counted in the diff
  static detectChanges(obj: any, initialObj: any, keep: string[]): { diffObj: any, count: number }
  {
    let count = 0;
    let diffObj: any = {};

    for (const key in obj)
    {
      if (keep.includes(key))
      {
        diffObj[key] = obj[key];
        continue;
      }

      if (Operation.isPrimitive(obj[key]))
      {
        if (obj[key] !== initialObj[key])
        {
          diffObj[key] = obj[key];
          count++;
        }
        continue;
      }

      if (Array.isArray(obj[key]))
      {
        diffObj[key] = [];
        const initialCount = count;
        for (let i = 0; i < obj[key].length; i++)
        {
          const changes = this.detectChanges(obj[key][i], initialObj[key][i], keep);
          count += changes.count;
          if (count > 0)
            diffObj[key].push(changes.diffObj);
        }
        // We don't want to keep the array if there are no changes
        if (initialCount === count)
          delete diffObj[key];

        continue
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
