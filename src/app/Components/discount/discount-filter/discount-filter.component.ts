import {Component, OnInit} from '@angular/core';
import {DataTableVector} from "../../filter/filter-table/filter-table.component";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import axios, {AxiosError} from "axios";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {api} from "../../../GlobalUsings";
import {UrlBuilder} from "../../../../utils/UrlBuilder";
import {FieldType} from "../../../../Enums/FieldType";
import {ITableData} from "../../../../Interfaces/ITableData";

@Component({
  selector: 'app-discount-filter',
  templateUrl: './discount-filter.component.html',
  styleUrls: ['./discount-filter.component.css', '../../../../styles/button.css']
})
export class DiscountFilterComponent implements OnInit
{
  filters: any[] = [];

  discounts: DataTableVector =
    {
      header: [],
      pageData: [], // The products of the current page.
      filteredIds: [], // The id of every product matching the filter.
      // So product of every page of the tab
    };

  rowsNumber: number = 50;

  // The products we did select. After it should be a list of ids.
  selectedDiscounts: any = {
    data: [], // the selected product (only the ones in the current page)
    ids: [] // all the selected product (including the ones not in the current filter)
  };

  // boolean
  loading: boolean = true;


  constructor(private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute)
  {
  }

  async ngOnInit(): Promise<void>
  {
    try
    {
      await this.fetchHeaders();
      await this.fetchFilter();
      await this.applyFilters();
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }
  }

  async fetchHeaders(): Promise<void>
  {
    this.discounts.header = [
      {
        label: 'Type de remise',
        field: 'discountType',
        type: FieldType.None,
        suffix: '',
      },
      {
        label: 'Valeur',
        field: 'value',
        type: FieldType.Percentage,
        suffix: '',
      },
      {
        label: 'Fabricant',
        field: 'manufacturer',
        type: FieldType.None,
        suffix: '',
      },
      {
        label: 'Distributeur',
        field: 'distributor',
        type: FieldType.None,
        suffix: '',
      },
      {
        label: "Nombre de produits l'utilisant",
        field: 'numberOfProducts',
        type: FieldType.Integer,
        suffix: '',
      }
    ];
    /*try
    {
      let response = await axios.get(`${api}/SelectDiscount/header`, {responseType: 'json'});
      if (response.status !== 200)
        return MessageServiceTools.httpFail(this.messageService, response);

      this.discounts.header = response.data;
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }*/
  }

  async fetchFilter()
  {
    try
    {
      let response = await axios.get(`${api}/SelectDiscount/filter`, {responseType: 'json'});
      if (response.status !== 200)
        return MessageServiceTools.httpFail(this.messageService, response);

      let tmp: any[] = response.data;
      tmp.forEach(filter => {
        filter.active = false;
        filter.value = null;
        if (filter.type === "range")
          filter.value = [0, 0];
      })
      this.filters = tmp;

      this.setDefaultFilterValue();
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }
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
    try
    {
      console.log(filters);
      let response = await axios.post(`${api}/SelectDiscount/filter/execute`, filters, {responseType: 'json'});
      if (response.status !== 200)
        return MessageServiceTools.httpFail(this.messageService, response);

      this.discounts.filteredIds = response.data;

      await this.loadLazy({first: 0, rows: this.rowsNumber});
    } catch (e: any)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }
  }

  async loadLazy(event: LazyLoadEvent)
  {
    this.loading = true;
    try
    {
      const begin: number = event.first ?? 0;
      const end: number = begin + (event.rows ?? 0);

      // get the ids of the products of the page
      const ids = this.discounts.filteredIds.slice(begin, end);
      const url = UrlBuilder.create(`${api}/SelectDiscount/filter/values`).addParam('ids', ids).build();
      const response = await axios.get(url, {responseType: 'json'});
      if (response.status !== 200)
        return MessageServiceTools.httpFail(this.messageService, response);

      // Update the productsPageData
      this.discounts.pageData = this.formatData(response.data);

      // Update the selected data
      this.selectedDiscounts.data = this.discounts.pageData
        .filter((product: any) => this.selectedDiscounts.ids.includes(product.id));

    } catch (e: any | AxiosError)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }
    this.loading = false;
  }

  // reformat the data received from the server
  // data being the raw data fetch from the server
  formatData(data: any[]): ITableData[]
  {
    console.log(data);
    for (const discount of data)
    {
      for (const header of this.discounts.header)
      {
        const field = header.field;
        discount[field] = ITableData.build(discount[field]);
        if (field === 'numberOfProducts')
          discount[field].tooltip = discount.productReferences;
      }
    }

    return data;
  }

  async editDiscount(discount: any)
  {

  }

  async editSelection()
  {
    // go to child route 'edit/multiple'
    await this.router.navigate(['../edit/multiple'], {relativeTo: this.route});
  }
}