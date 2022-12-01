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
      id: 6190,
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
      id: 6237,
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
      id: 1387,
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
  productsPageData: any[] = [];
  // The products we did select. After it should be a list of ids.
  selectedProducts: any = {
    data: [], // the selected product (only the ones in the current page)
    ids: [] // al the selected product (including the ones not in the curent filter)
  };
  totalRecords: number;

  // boolean
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
  }

  loadProductsLazy(event: LazyLoadEvent)
  {
    this.loading = true;
    console.log(event);

    const begin: number = event.first ?? 0;
    const end: number = begin + (event.rows ?? 0);

    this.productsPageData = this.allProductsData.slice(begin, end);

    this.loading = false;
  }


  onSelectionChange(value: any[] = [])
  {
    /* console.log(value.length);
     console.log(this.selectedProducts.data.length);
     this.selectedProducts.data = value;
     console.log("onSelectionChange");*/
    console.log('this.selectedProducts', this.selectedProducts)
  }

  // (selectAllChange)="onSelectAllChange($event)"

  onRowSelect(event: any)
  {
    this.selectedProducts.ids.push(event.data.id);
  }

  onRowUnselect(event: any)
  {
    this.selectedProducts.ids = this.selectedProducts.ids.filter((id: number) => id !== event.data.id);
  }

  onSelectAllChange(event: any)
  {
    const checked: boolean = event.checked;

    if (checked)
    {
      // problem with lazy loads
      this.selectedProducts.data = this.allProductsData;

      // get all ids that where unselected
      const newIds = this.selectedProducts.data
        .map((product: any) => product.id)
        .filter((id: number) => !this.selectedProducts.ids.includes(id));

      // concat the ids of the selected products
      this.selectedProducts.ids = this.selectedProducts.ids.concat(newIds);
    }
    else
    {
      this.selectedProducts.ids =
        this.selectedProducts.ids.filter((id: number) => !this.selectedProducts.ids.includes(id));
      this.selectedProducts.data = [];
    }

    console.log(this.selectedProducts);

  }
}
