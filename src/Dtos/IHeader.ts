import {FieldType} from "../Enums/FieldType";

export interface IHeader
{
  label: string;
  field: string;
  type: FieldType;
  suffix?: string;
}
