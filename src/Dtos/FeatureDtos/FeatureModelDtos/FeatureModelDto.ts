import {FeatureValueDto} from "../FeatureValueDtos/FeatureValueDto";
import {NullableIdPrestashopShopDto} from "../../NullableIdPrestashopShopDto";

export interface FeatureModelDto
{
    id: number;
    name: string;
    shopSpecifics: NullableIdPrestashopShopDto[];
    values: FeatureValueDto[];
}