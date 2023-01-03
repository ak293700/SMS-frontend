import {IChanges} from "../Interfaces/IChanges";
import {Operation} from "./Operation";

export class CheckingTools
{
  private static readonly SpecialCharacters =
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']',
      '{', '}', '|', '\\', ':', ';', '"', '\'', '<', '>', ',', '.', '?', '/'];

  static IsPasswordValid(password: string): boolean
  {
    if (password.length < 8)
      return false;

    if (password.match(/\s/))
      return false;

    if (!password.split('').some(char => char === char.toUpperCase()))
      return false;

    if (!password.split('').some(char => char === char.toLowerCase()))
      return false;

    if (!password.split('').some(char => !isNaN(Number(char))))
      return false;

    if (!password.split('').some(char => CheckingTools.SpecialCharacters.includes(char)))
      return false;

    return true;
  }


  // keep is a list of properties that should not be compared
  // should be keep in the diff
  // shouldn't be counted in the diff
  static detectChanges(obj: any, initialObj: any, keep: string[] = []): IChanges
  {
    if (typeof obj !== typeof initialObj || obj != initialObj && (obj == null || initialObj == null))
      return {diffObj: obj, count: 1};

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

    // get all teh keys of bth objects
    let keys = Object.keys(obj).concat(Object.keys(initialObj));
    keys = keys.filter((key, index) => keys.indexOf(key) === index)

    for (const key of keys)
    {
      if (keep.includes(key)) // often use for the id
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
