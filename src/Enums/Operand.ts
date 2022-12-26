export enum Operand
{
  Add = 0,
  Subtract,
  Multiply,
  Equal,
}

export namespace Operand
{
  export function toString(operand: Operand): string
  {
    switch (operand)
    {
      case Operand.Add:
        return '+';
      case Operand.Subtract:
        return '-';
      case Operand.Multiply:
        return 'x';
      case Operand.Equal:
        return '=';
    }
  }

  export function toEnum(s: string): Operand
  {
    switch (s)
    {
      case '+':
        return Operand.Add;
      case '-':
        return Operand.Subtract;
      case 'x':
        return Operand.Multiply;
      case '=':
        return Operand.Equal;
    }
    // @ts-ignorexxw
    return undefined;
  }
}
