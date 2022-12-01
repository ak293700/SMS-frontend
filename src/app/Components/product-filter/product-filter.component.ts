import {Component, Input} from '@angular/core';
import {LazyLoadEvent} from "primeng/api";

/*
  * This component is used to display the filter form.
  * It shows the results of the filter below it.
  * The fields in the filter and the table can be different.
 */

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent
{
  // @ts-ignore initialize in the constructor
  filters: any[];

  // We do not add the photo field in the header because it is mange differently.
  // Do that to display markup instead of text.
  productsHeader: any[] = [
    {
      label: 'Référence produit',
      field: 'productReference',
    },
    {
      label: 'Nom ElecProShop',
      field: 'name',
    },
    {
      label: 'Id Prestashop',
      field: 'idPrestashop',
    },
    {
      label: 'Marque',
      field: 'brand',
    },
    {
      label: 'Catégorie principale',
      field: 'mainCategory',
    },
    {
      label: 'Famille fournisseur',
      field: 'supplierFamily',
    },
    {
      label: 'Actif',
      field: 'active',
    },
    {
      label: 'Popularité',
      field: 'popularity',
    },
    {
      label: 'Type de produit',
      field: 'productType',
    },
    {
      label: 'Prix de vente TTC',
      field: 'salePriceIt',
    },
    {
      label: 'Taux de marge',
      field: 'marginRate',
    },
    {
      label: 'Écart ElecPlusSimple',
      field: 'esDifference',
    },
  ];

  // The id of every product matching the filter.
  productsId: number[] = [6190, 6237, 1387];

  // There for test purposes.
  allProductsData: any[] = [
    {
      photo: 'https://cdn3.elecproshop.com/36742-medium_default/interrupteur-commande-vmc-vitesse-1-vitesse-2.jpg',
      productReference: "67001",
      name: "Interrupteur Commande VMC - 2 Vitesse Céliane",
      idPrestashop: "1226 | 1226",
      mainCategory: "Appareillage Céliane à composer",
      supplierFamily: "Non défini",
      active: "Oui | Oui",
      popularity: "Level4",
      productType: "Simple",
      brand: "Legrand",
      salePriceIt: "7.98€",
      marginRate: "22%",
      esDifference: "37.89%",
    },
    {
      photo: 'https://cdn3.elecproshop.com/35498-medium_default/double-va-et-vient.jpg',
      productReference: "67001D",
      name: "Double Interrupteur Va Et Vient Céliane",
      idPrestashop: "10184 | 10184",
      mainCategory: "Appareillage Céliane à composer",
      supplierFamily: "Non défini",
      active: "Oui | Oui",
      popularity: "Level4",
      productType: "Bundle",
      brand: "Legrand",
      salePriceIt: "19.46€",
      marginRate: "24%",
      esDifference: "36.99%",
    },
    {
      photo: 'https://cdn2.elecproshop.com/32255-medium_default/radiateur-electrique-a-fluide-750-w-bilbao-3.jpg',
      productReference: "T493821",
      name: "Radiateur Bilbao 3 - 750W - Fluide Caloporteur",
      idPrestashop: "9510 | 96193",
      mainCategory: "Radiateurs à inertie fluide",
      supplierFamily: "Non défini",
      active: "Oui | Oui",
      popularity: "Level1",
      productType: "Simple",
      brand: "Thermor",
      salePriceIt: "545.77€",
      marginRate: "17%",
      esDifference: "8.85%",
    }
  ];

  // The products of the current page.
  productsData: any[] = [];
  // The products we did select. After it should be a list of ids.
  selectedProducts: any[] = [];
  totalRecords: number;

  loading: boolean = false;


  // Private we use getter and setter to manipulate it.
  _displayedProductHeader = this.productsHeader;

  constructor()
  {
    this.fetchFilter();
    this.totalRecords = this.productsId.length;
  }

  @Input() get displayedProductHeader(): any[]
  {
    // remove @Input() from function signature
    return this._displayedProductHeader;
  }

  set displayedProductHeader(val: any[])
  {
    // restore original order
    this._displayedProductHeader = this.productsHeader
      .filter(col => val.includes(col));
  }

  fetchFilter()
  {
    this.filters = [
      {
        label: "Référence produit",
        value: null,
        type: "text"
      },
      {
        label: "Id Prestashop",
        value: null,
        type: "number"
      },
      {
        label: "Nom ElecProShop",
        value: null,
        type: "text"
      },
      {
        label: "Marque",
        value: null,
        type: "text"
      },
      {
        label: "Catégorie",
        value: null,
        type: "text"
      },
      {
        label: "Famille fournisseur",
        value: null,
        type: "text"
      },
      {
        label: "Actif",
        value: null,
        type: "checkbox"
      },
      {
        label: "Type",
        value: null,
        type: "text"
      },
      {
        label: "Promotion",
        value: null,
        type: "range"
      },
      {
        label: "Date fin promotion",
        value: null,
        type: "date"
      },
      {
        label: "Taux de marge",
        value: null,
        type: "range"
      },
      {
        label: "Coefficient de marge",
        value: null,
        type: "range"
      },
      {
        label: "Écart ElecPlusSimple",
        value: null,
        type: "range"
      }
    ];
    this.filters.forEach(filter => {
      filter.active = false;
      if (filter.type === "range")
        filter.value = [0, 0];
    })
  }

  applyFilters()
  {
    // keep only the active filters
    let filters = this.filters.filter(filter => filter.active);

    console.log(filters);
  }

  loadProductsLazy(event: LazyLoadEvent)
  {
    this.loading = true;
    console.log(event);

    const begin: number = event.first ?? 0;
    const end: number = begin + (event.rows ?? 0);

    this.productsData = this.allProductsData.slice(begin, end);

    this.loading = false;
  }

}
