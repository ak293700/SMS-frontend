import {FieldType} from "../Enums/FieldType";

export interface HeaderDto
{
  label: string;
  field: string;
  type: FieldType;
  suffix: string;
}
