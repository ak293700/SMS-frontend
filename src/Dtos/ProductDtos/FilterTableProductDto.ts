import {ProductPopularity} from "../../Enums/ProductPopularity";
import {ProductType} from "../../Enums/ProductType";
import {FilterTableShopSpecificDto} from "../ShopSpecificDtos/FilterTableShopSpecificDto";
import {IEnumerableByString} from "../../Interfaces/IEnumerableByString";

export interface FilterTableProductDto extends IEnumerableByString
{
  id: number;
  productType: ProductType;
  productReference: string;
  purchasePrice: number;
  photo: string;
  manufacturer: string;
  manufacturerFamily: string;
  popularity: ProductPopularity;
  shopSpecifics: FilterTableShopSpecificDto[];
}

/*
[
        {
          label: 'Référence produit',
          field: 'productReference',
          type: FieldType.None
        },
        {
          label: 'Nom',
          field: 'name',
          type: FieldType.None
        },
        {
          label: 'Id Prestashop',
          field: 'idPrestashop',
          type: FieldType.None
        },
        {
          label: 'Fabricant',
          field: 'manufacturer',
          type: FieldType.None
        },
        {
          label: 'Catégorie principale',
          field: 'mainCategory',
          type: FieldType.None
        },
        {
          label: 'Famille fabricant',
          field: 'manufacturerFamily',
          type: FieldType.None
        },
        {
          label: 'Actif',
          field: 'active',
          type: FieldType.None
        },
        {
          label: 'Popularité',
          field: 'popularity',
          type: FieldType.None
        },
        {
          label: 'Type de produit',
          field: 'productType',
          type: FieldType.None
        },
        {
          label: 'Prix de vente',
          field: 'salePriceIt',
          type: FieldType.Currency
        },
        {
          label: 'Taux de marge',
          field: 'marginRate',
          type: FieldType.Percentage
        },
        {
          label: 'Différence ElecPlusSimple',
          field: 'esDiff',
          type: FieldType.Percentage
        },
      ];
*/
