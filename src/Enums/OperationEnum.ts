export enum OperationEnum
{
  Add = 0,
  Subtract,
  Multiply,
  Equal,
}

export namespace OperationEnum
{
  export function toString(operation: OperationEnum): string
  {
    switch (operation)
    {
      case OperationEnum.Add:
        return '+';
      case OperationEnum.Subtract:
        return '-';
      case OperationEnum.Multiply:
        return 'x';
      case OperationEnum.Equal:
        return '=';
    }
  }
}
