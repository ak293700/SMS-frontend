import {Shop} from "../../Enums/Shop";
import {RequestWithOperandDto} from "../RequestWithOperandDto";

export interface ShopSpecificMultipleChangesDto
{
  shop?: Shop;
  active?: boolean;
  km?: RequestWithOperandDto<number>;
  promotion?: RequestWithOperandDto<number>;
}
