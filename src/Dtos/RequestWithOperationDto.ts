import {Operand} from "../Enums/Operand";

export interface RequestWithOperationDto<T>
{
  data: T;
  operand: Operand;
}
