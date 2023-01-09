import {Component, OnInit} from '@angular/core';
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {UrlBuilder} from "../../../../utils/UrlBuilder";
import {api} from "../../../GlobalUsings";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {DataTableVector, SelectedData} from "../../filter/filter-table/filter-table.component";
import {IEnumerableToITableData, ITableData} from "../../../../Interfaces/ITableData";
import {FieldType} from "../../../../Enums/FieldType";
import {FilterTableProductDto} from "../../../../Dtos/ProductDtos/FilterTableProductDto";
import {FilterTableShopSpecificDto} from "../../../../Dtos/ShopSpecificDtos/FilterTableShopSpecificDto";
import {ProductType} from "../../../../Enums/ProductType";
import {ProductPopularity} from "../../../../Enums/ProductPopularity";
import {Operation} from "../../../../utils/Operation";
import {Shop} from "../../../../Enums/Shop";
import {HttpTools} from "../../../../utils/HttpTools";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";

/*
  * This component is used to display the filter form.
  * It shows the results of the filter below it.
  * The fields in the filter and the table can be different.
 */

// Store everything to manage a product show in the table

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css', '../../../../styles/button.css'],
})
export class ProductFilterComponent implements OnInit
{
  // initialize in the constructor
  filters: any[] = [];

  // We do not add the photo field to use it with html markup.
  // The id of every product matching the filter.
  products: DataTableVector =
    {
      header: [],
      pageData: [], // The products of the current page.
      filteredIds: [], // The id of every product matching the filter.
      // So product of every page of the tab
    };

  rowsNumber: number = 50;

  // The products we did select. After it should be a list of ids.
  selectedProducts: SelectedData = {
    data: [], // the selected product (only the ones in the current page)
    ids: [] // al the selected product (including the ones not in the curent filter)
  };

  // boolean
  loading: boolean = true;

  constructor(private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private http: HttpClientWrapperService)
  {}

  async ngOnInit(): Promise<void>
  {
    this.fetchHeaders();
    await this.fetchFilter();
    await this.applyFilters();
  }

  fetchHeaders(): void
  {
    this.products.header =
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
          type: FieldType.Integer
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
  }

  async fetchFilter()
  {
      const response = await this.http.get(`${api}/SelectProduct/filter`);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);

      let tmp: any[] = response.body;
      tmp.forEach(filter => {
        filter.active = false;
        filter.value = null;
        if (filter.type === "range")
          filter.value = [0, 0];
      })
      this.filters = tmp;

      this.setDefaultFilterValue();
  }

  setDefaultFilterValue()
  {
    for (const filter of this.filters)
    {
      switch (filter.type)
      {
        case "range":
          filter.value = [0, 0];
          break;
        case "checkbox":
          filter.value = false;
          break;
        case "text":
          filter.value = "";
          break;
      }
    }
  }

  async applyFilters()
  {
    // keep only the active filters
    let filters = this.filters.filter(filter => filter.active);
    const response = await this.http.post(`${api}/SelectProduct/filter/execute`, filters);
    if (!HttpTools.IsValid(response.status))
      MessageServiceTools.httpFail(this.messageService, response);

    this.products.filteredIds = response.body;

    await this.loadLazy({first: 0, rows: this.rowsNumber});
  }

  async loadLazy(event: LazyLoadEvent)
  {
    this.loading = true;

      const begin: number = event.first ?? 0;
      const end: number = begin + (event.rows ?? 0);

      // get the ids of the products of the page
      const ids = this.products.filteredIds.slice(begin, end);
      const url = UrlBuilder.create(`${api}/SelectProduct/filter/values`).addParam('ids', ids).build();
      const response = await this.http.get(url);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);

      // Update the productsPageData
      this.products.pageData = this.formatData(response.body);

      // Update the selected data
      this.selectedProducts.data = this.products.pageData
        .filter((product: IEnumerableToITableData) => this.selectedProducts.ids.includes(product.id));

    this.loading = false;
  }

  // For each data of the page it will set default for some field
  formatData(datas: FilterTableProductDto[]): IEnumerableToITableData[]
  {
    const res: IEnumerableToITableData[] = []; // row1, row2, ...
    for (const data of datas)
    {
      let row: IEnumerableToITableData = {id: data.id}; // id, name, ...
      for (const header of this.products.header)
      {
        const field = header.field;
        row[field] = this._formatOneData(data, field);
      }
      row['photo'] = ITableData.build(data.photo);
      res.push(row);
    }

    return res;
  }

  private _formatOneData(product: FilterTableProductDto, field: string): ITableData
  {
    let data: any = product[field];
    const shopSpecific: FilterTableShopSpecificDto[] = product.shopSpecifics;
    const firstShop: FilterTableShopSpecificDto | undefined = Operation.firstOrDefault(shopSpecific);
    let tooltip: string = "";

    switch (field)
    {
      case 'name':
        data = firstShop?.name;
        break;
      case 'idPrestashop':
        data = firstShop?.idPrestashop;
        tooltip = shopSpecific
          .map((ss) => `${Shop.toString(ss.shop)}: ${ss.idPrestashop}`)
          .join("\n");
        break;
      case 'mainCategory':
        data = firstShop?.mainCategory;
        break;
      case 'active':
        data = shopSpecific.map((ss) => ss.active).includes(true);
        tooltip = shopSpecific
          .map((ss) => `${Shop.toString(ss.shop)}: ${ss.active}`).join("\n");
        break;
      case 'popularity':
        data = ProductPopularity.toString(data);
        break;
      case 'productType':
        data = ProductType.toString(data);
        break;
      case 'salePriceIt':
        if (firstShop !== undefined)
        {
          data = firstShop.salePriceIt;
          tooltip = shopSpecific
            .map((ss) => `${Shop.toString(ss.shop)}: ${ss.salePriceIt.toFixed(2)}€`)
            .join("\n");
        }
        break;
      case 'marginRate':
        if (firstShop !== undefined)  // (pVht - pAht) / pVht
        {
          const salePriceEt: number = firstShop.salePriceIt / 1.2;
          data = (salePriceEt - product.purchasePrice) / salePriceEt;
          tooltip = shopSpecific
            .map((ss) =>
            {
              const salePriceEt: number = ss.salePriceIt / 1.2;
              const marginRate: number = (salePriceEt - product.purchasePrice) / salePriceEt;
              return `${Shop.toString(ss.shop)}: ${(marginRate * 100).toFixed(2)}%`;
            })
            .join("\n");
        }
        break;
      case 'esDiff':
        const eps = shopSpecific[0];
        const es = shopSpecific[1];
        if (shopSpecific.length > 1) // there is a diff
          data = (eps.salePriceIt - es.salePriceIt) / es.salePriceIt;
        else
          data = undefined
        break;
    }

    return ITableData.build(data, tooltip);
  }

  async editProduct(product: IEnumerableToITableData)
  {
    await this.router.navigate(['../edit/one'], {
      relativeTo: this.route,
      state:
          {
            selectedIds: this.selectedProducts.ids
                .sort((a: number, b: number) =>
                    this.products.filteredIds.indexOf(a) - this.products.filteredIds.indexOf(b)),
            selectedId: product.id
          }
    });
  }

  async editSelection()
  {
    await this.router.navigate(['../edit/multiple'], {
      relativeTo: this.route,
      state:
        {
          selectedIds: this.selectedProducts.ids
              .sort((a: number, b: number) =>
                  this.products.filteredIds.indexOf(a) - this.products.filteredIds.indexOf(b))
        }
    });
  }
}
