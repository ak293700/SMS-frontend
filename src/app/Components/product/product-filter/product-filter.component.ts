import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LazyLoadEvent, MenuItem, MessageService} from "primeng/api";
import axios, {AxiosError, AxiosResponse} from "axios";
import {api} from "../../../GlobalUsings";
import {HeaderDto} from "../../../../Dtos/HeaderDto";
import {ActivatedRoute, Router} from "@angular/router";
import {UrlBuilder} from "../../../../utils/UrlBuilder";

/*
  * This component is used to display the filter form.
  * It shows the results of the filter below it.
  * The fields in the filter and the table can be different.
 */

// Store everything to manage a product show in the table
interface ProductTableVector
{
  header: HeaderDto[];
  pageData: any[];
  filteredIds: number[];
}

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css'],
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
      filteredIds: [], // The id of every product matching the filter.
      // So product of every page of the tab
    };

  rowsNumber: number = 50;

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

  // Context menu for the product of the table
  contextMenuItems: MenuItem[];
  contextMenuSelectedProduct: any;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute)
  {
    this.contextMenuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.editProduct(this.contextMenuSelectedProduct)
      }
    ];
  }

  async ngOnInit(): Promise<void>
  {
    try
    {
      await this.fetchHeaders();
      await this.fetchFilter();
      await this.applyFilters();
      this.changeDetectorRef.detectChanges();
    } catch (e: any | AxiosError)
    {
      this.networkError(e.message);
    }

  }

  get displayedProductHeader(): any[]
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
    try
    {
      let response = await axios.get(`${api}/SelectProduct/header`, {responseType: 'json'});
      if (response.status !== 200)
        return this.httpFail(response);

      this.products.header = response.data;
      this._displayedProductHeader = this.products.header; // Allow to have everything selected at the beginning.
    } catch (e: any | AxiosError)
    {
      this.networkError(e.message);
    }
  }

  async fetchFilter()
  {
    try
    {
      let response = await axios.get(`${api}/SelectProduct/filter`, {responseType: 'json'});
      if (response.status !== 200)
        return this.httpFail(response);

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
      this.networkError(e.message);
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
      let response = await axios.post(`${api}/SelectProduct/filter/execute`, filters, {responseType: 'json'});
      if (response.status !== 200)
        return this.httpFail(response);

      this.products.filteredIds = response.data;
      this.totalRecords = this.products.filteredIds.length;

      await this.loadProductsLazy({first: 0, rows: this.rowsNumber});
    } catch (e: any)
    {
      this.networkError(e.message);
    }
  }

  async loadProductsLazy(event: LazyLoadEvent)
  {
    this.loading = true;

    const begin: number = event.first ?? 0;
    const end: number = begin + (event.rows ?? 0);

    // get the ids of the products of the page
    const ids = this.products.filteredIds.slice(begin, end);
    const url = UrlBuilder.create(`${api}/SelectProduct/filter/values`).addParam('ids', ids).build();
    const response = await axios.get(url, {responseType: 'json'});
    if (response.status !== 200)
      return;

    // Update the productsPageData
    this.products.pageData = response.data;

    // Update the selected data
    this.selectedProducts.data = this.products.pageData
      .filter((product: any) => this.selectedProducts.ids.includes(product.id));

    this.setDefaultPageData();

    this.loading = false;
  }

  // For each data of the page it will set default for some field
  setDefaultPageData()
  {
    for (const product of this.products.pageData)
    {
      // if product.photo is null or empty, we set a default image
      if (!product.photo || product.photo === "")
        product.photo = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
    }
  }

  onRowSelect(event: any)
  {
    this.selectedProducts.ids.push(event.data.id);

    // If there is at least enough product selected that product find
    if (this.selectedProducts.ids.length >= this.products.filteredIds.length)
    {
      // Need to check that all the product are selected
      for (let i = 0; i < this.products.filteredIds.length; i++)
      {
        if (!this.selectedProducts.ids.includes(this.products.filteredIds[i]))
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
    const newIds = this.products.filteredIds
      .filter((id: number) => !this.selectedProducts.ids.includes(id));

    // concat the ids of the selected products
    this.selectedProducts.ids = this.selectedProducts.ids.concat(newIds);

  }

  onUnselectAll()
  {
    this.areAllSelected = false;

    this.selectedProducts.ids =
      this.selectedProducts.ids.filter((id: number) => !this.products.filteredIds.includes(id));


    this.selectedProducts.data = [];
  }

  dropDownFilter(event: any, filter: any)
  {
    // Todo does not works
    filter.others =
      filter.others.filter((other: any) => other.toLowerCase().includes(event.query.toLowerCase()));
  }


  unselectAll()
  {
    this.selectedProducts.ids = [];
    this.selectedProducts.data = [];
    this.areAllSelected = false;
  }

  networkError(message: string)
  {
    this.messageService.add({severity: 'error', summary: 'Network error', detail: message});
    this.loading = false;
  }

  httpFail(response: AxiosResponse)
  {
    console.log('HTTP error');
    this.messageService.add({severity: 'warn', summary: response.statusText, detail: response.data});
  }

  async editProduct(product: any)
  {
    await this.router.navigate(['../edit/one'], {
      relativeTo: this.route,
      state: {filteredIds: this.products.filteredIds, selectedId: product.id}
    });
  }

  async editSelection()
  {
    // go to child route 'edit/multiple'
    await this.router.navigate(['../edit/multiple'], {relativeTo: this.route});
  }
}
