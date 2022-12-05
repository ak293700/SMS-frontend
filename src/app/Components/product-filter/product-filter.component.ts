import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LazyLoadEvent} from "primeng/api";
import axios from "axios";
import {api} from "../../GlobalUsings";
//  [
//         {
//           label: 'Référence produit',
//           field: 'productReference',
//         },
//         {
//           label: 'Nom ElecProShop',
//           field: 'name',
//         },
//         {
//           label: 'Id Prestashop',
//           field: 'idPrestashop',
//         },
//         {
//           label: 'Fabricant',
//           field: 'manufacturer',
//         },
//         {
//           label: 'Catégorie principale',
//           field: 'mainCategory',
//         },
//         {
//           label: 'Famille fabricant',
//           field: 'manufacturerFamily',
//         },
//         {
//           label: 'Actif',
//           field: 'active',
//         },
//         {
//           label: 'Popularité',
//           field: 'popularity',
//         },
//         {
//           label: 'Type de produit',
//           field: 'productType',
//         },
//         {
//           label: 'Prix de vente TTC',
//           field: 'salePriceIt',
//         },
//         {
//           label: 'Taux de marge',
//           field: 'marginRate',
//         },
//         {
//           label: 'Écart ElecPlusSimple',
//           field: 'esDiff',
//         },
//       ]


/*
  * This component is used to display the filter form.
  * It shows the results of the filter below it.
  * The fields in the filter and the table can be different.
 */

// Store everything to manage a product show in the table
interface ProductTableVector
{
  header: any[];
  pageData: any[];
  allId: number[];
}

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit
{
  // initialize in the constructor
  filters: any[] = [];

  // We do not add the photo field to use it with html markup.
  // The id of every product matching the filter.
  products: ProductTableVector =
    {
      header: [],
      pageData: [], // The products of the current page.
      allId: [], // The id of every product matching the filter.
      // So product of every page of the tab
    };

  rowsNumber: number = 50;

  // There for test purposes.
  // allProductsData: any[] = [
  //   {
  //     id: 6190,
  //     photo: 'https://cdn3.elecproshop.com/36742-medium_default/interrupteur-commande-vmc-vitesse-1-vitesse-2.jpg',
  //     productReference: "67001",
  //     name: "Interrupteur Commande VMC - 2 Vitesse Céliane",
  //     idPrestashop: "1226 | 1226",
  //     mainCategory: "Appareillage Céliane à composer",
  //     manufacturerFamily: "Non défini",
  //     active: "Oui | Oui",
  //     popularity: "Level4",
  //     productType: "Simple",
  //     manufacturer: "Legrand",
  //     salePriceIt: "7.98€",
  //     marginRate: "22%",
  //     esDiff: "37.89%",
  //   },
  //   {
  //     id: 6237,
  //     photo: 'https://cdn3.elecproshop.com/35498-medium_default/double-va-et-vient.jpg',
  //     productReference: "67001D",
  //     name: "Double Interrupteur Va Et Vient Céliane",
  //     idPrestashop: "10184 | 10184",
  //     mainCategory: "Appareillage Céliane à composer",
  //     manufacturerFamily: "Non défini",
  //     active: "Oui | Oui",
  //     popularity: "Level4",
  //     productType: "Bundle",
  //     manufacturer: "Legrand",
  //     salePriceIt: "19.46€",
  //     marginRate: "24%",
  //     esDiff: "36.99%",
  //   },
  //   {
  //     id: 1387,
  //     photo: 'https://cdn2.elecproshop.com/32255-medium_default/radiateur-electrique-a-fluide-750-w-bilbao-3.jpg',
  //     productReference: "T493821",
  //     name: "Radiateur Bilbao 3 - 750W - Fluide Caloporteur",
  //     idPrestashop: "9510 | 96193",
  //     mainCategory: "Radiateurs à inertie fluide",
  //     manufacturerFamily: "Non défini",
  //     active: "Oui | Oui",
  //     popularity: "Level1",
  //     productType: "Simple",
  //     manufacturer: "Thermor",
  //     salePriceIt: "545.77€",
  //     marginRate: "17%",
  //     esDiff: "8.85%",
  //   }
  // ];

  // The products we did select. After it should be a list of ids.
  selectedProducts: any = {
    data: [], // the selected product (only the ones in the current page)
    ids: [] // al the selected product (including the ones not in the curent filter)
  };
  areAllSelected: boolean = false;

  totalRecords: number = 0;

  // boolean
  loading: boolean = true;

  // Private we use getter and setter to manipulate it.
  _displayedProductHeader = this.products.header;

  constructor(private changeDetectorRef: ChangeDetectorRef)
  {}

  async ngOnInit(): Promise<void>
  {
    await this.fetchHeaders();
    await this.fetchFilter();
    await this.applyFilters();

    this.changeDetectorRef.detectChanges();
  }


  @Input() get displayedProductHeader(): any[]
  {
    // remove @Input() from function signature
    return this._displayedProductHeader;
  }

  set displayedProductHeader(val: any[])
  {
    // restore original order
    this._displayedProductHeader = this.products.header
      .filter((col: any) => val.includes(col));
  }

  async fetchHeaders()
  {
    let response = await axios.get(`${api}/SelectProduct/header`, {responseType: 'json'});
    if (response.status !== 200)
      return;


    this.products.header = response.data;
  }

  async fetchFilter()
  {
    /*    this.filters = [
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
    ];*/

    let response = await axios.get(`${api}/SelectProduct/filter`, {responseType: 'json'});
    if (response.status !== 200)
      return;

    let tmp: any[] = response.data;
    tmp.forEach(filter => {
      filter.active = false;
      filter.value = null;
      if (filter.type === "range")
        filter.value = [0, 0];
    })
    this.filters = tmp;

    console.log(this.filters);
  }

  async applyFilters()
  {
    // keep only the active filters
    let filters = this.filters.filter(filter => filter.active);
    try
    {
      let response = await axios.post(`${api}/SelectProduct/filter/execute`, filters, {responseType: 'json'});
      if (response.status !== 200)
        return;

      this.products.allId = response.data;
      this.totalRecords = this.products.allId.length;

      await this.loadProductsLazy({first: 0, rows: this.rowsNumber});
    } catch (e)
    {
      // @ts-ignore
      console.log(e.response.data);
    }
  }

  async loadProductsLazy(event: LazyLoadEvent)
  {
    this.loading = true;

    const begin: number = event.first ?? 0;
    const end: number = begin + (event.rows ?? 0);

    // get the ids of the products of the page
    const ids = this.products.allId.slice(begin, end);
    const joinedIds = ids.length > 0 ? "ids=" + ids.join("&ids=") : "";

    const response = await axios.get(`${api}/SelectProduct/filter/values?${joinedIds}`, {responseType: 'json'});
    if (response.status !== 200)
      return;

    // Update the productsPageData
    this.products.pageData = response.data;

    // Update the selected data
    this.selectedProducts.data = this.products.pageData
      .filter((product: any) => this.selectedProducts.ids.includes(product.id));

    for (const product of this.products.pageData)
    {
      if (product.photo === "#")
        product.photo = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
    }

    this.loading = false;
  }

  onRowSelect(event: any)
  {
    this.selectedProducts.ids.push(event.data.id);

    // If there is at least enough product selected that product find
    if (this.selectedProducts.ids.length >= this.products.allId.length)
    {
      // Need to check that all the product are selected
      for (let i = 0; i < this.products.allId.length; i++)
      {
        if (!this.selectedProducts.ids.includes(this.products.allId[i]))
          return;
      }

      this.areAllSelected = true;
    }

  }

  onRowUnselect(event: any)
  {
    this.selectedProducts.ids = this.selectedProducts.ids.filter((id: number) => id !== event.data.id);
    this.areAllSelected = false;
  }

  onSelectAllChange(event: any)
  {
    if (event.checked)
      this.onSelectAll()
    else
      this.onUnselectAll();
  }

  onSelectAll()
  {
    this.areAllSelected = true;

    // Can't select everything because the data of others pages are not loaded.
    // We fake it by selecting everything of our page and adding the ids of the others pages.
    // + on page change we update selectedProducts.data to keep the selected products.
    this.selectedProducts.data = this.products.pageData;

    // Get all ids that where unselected
    const newIds = this.products.allId
      .filter((id: number) => !this.selectedProducts.ids.includes(id));

    // concat the ids of the selected products
    this.selectedProducts.ids = this.selectedProducts.ids.concat(newIds);

  }

  onUnselectAll()
  {
    this.areAllSelected = false;

    this.selectedProducts.ids =
      this.selectedProducts.ids.filter((id: number) => !this.products.allId.includes(id));


    this.selectedProducts.data = [];
  }

  dropDownFilter(event: any, filter: any)
  {
    filter.others =
      filter.others.filter((other: any) => other.toLowerCase().includes(event.query.toLowerCase()));
  }
}
