import {LiteDiscountDto} from "../LiteDiscountDto";

export interface LiteDerogationDto extends LiteDiscountDto
{
  manufacturerId: number;
  distributorIds: number[];
}
