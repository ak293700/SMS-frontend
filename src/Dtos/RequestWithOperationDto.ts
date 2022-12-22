import {OperationEnum} from "../Enums/OperationEnum";

export interface RequestWithOperationDto<T>
{
  data: T;
  operation: OperationEnum;
}
