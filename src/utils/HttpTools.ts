export class HttpTools
{
  static IsCode(code: number, expectedCode: number): boolean
  {
    return this.getCode(code) == expectedCode;
  }

  // return the default http code of the given code
  // exemple: 201 -> 200
  // exemple: 404 -> 400
  static getCode(code: number): number
  {
    return code - code % 100;
  }
}
