import {ChangeType} from "../../Enums/ChangeType";

export interface ProductChangesRequestDto
{
  ids: number[];
  changeTypes: ChangeType[];
}
