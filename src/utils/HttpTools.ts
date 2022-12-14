export class HttpTools
{
  static IsValid(code: number): boolean
  {
    return this.IsCode(code, 200);
  }

  static IsError(code: number): boolean
  {
    return this.IsCode(code, 400);
  }

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
