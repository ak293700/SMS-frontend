import {Operand} from "../Enums/Operand";

export interface RequestWithOperandDto<T>
{
  data: T;
  operand: Operand;
}
