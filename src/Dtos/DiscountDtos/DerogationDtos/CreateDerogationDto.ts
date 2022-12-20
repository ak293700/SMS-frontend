import {CreateDiscountDto} from "../CreateDiscountDto";

export interface CreateDerogationDto extends CreateDiscountDto
{
  manufacturerId: number;
  distributorIds: number[];
}
