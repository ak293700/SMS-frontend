import {IdPrestashopShopDto} from "../../IdPrestashopShopDto";

export interface FeatureModelDto
{
    id: number;
    name: string;
    shopSpecifics: IdPrestashopShopDto[];
    // values: FeatureValueDto[];
}