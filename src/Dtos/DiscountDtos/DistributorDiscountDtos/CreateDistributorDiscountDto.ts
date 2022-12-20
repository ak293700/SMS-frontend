import {CreateDiscountDto} from "../CreateDiscountDto";

export interface CreateDistributorDiscountDto extends CreateDiscountDto
{
  distributorId: number;
}
