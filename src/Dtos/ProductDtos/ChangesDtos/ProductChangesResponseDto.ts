import {ShopCountDto} from "../../ShopDtos/ShopCountDto";

export interface ProductChangesResponseDto
{
  directChangesCount: number;
  indirectChangesCount?: number;
  shopCounts?: ShopCountDto[];
}
