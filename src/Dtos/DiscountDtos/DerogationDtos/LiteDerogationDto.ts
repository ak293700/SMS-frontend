import {LiteDiscountDto} from "../LIteDiscountDto";

export interface LiteDerogationDto extends LiteDiscountDto
{
  manufacturerId: number;
  distributorIds: number[];
}
