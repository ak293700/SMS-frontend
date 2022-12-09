import {Component, OnInit} from '@angular/core';

/*
  * This component is used to display the filter form.
  * It shows the results of the filter below it.
  * The fields in the filter and the table can be different.
 */

// Store everything to manage a product show in the table

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: [
    './product-filter.component.css',
    '../../../../styles/button.css'
  ],
})
export class ProductFilterComponent implements OnInit
{
  ngOnInit(): void
  {
  }

  /*  // initialize in the constructor
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
    selectedProducts: any = {
      data: [], // the selected product (only the ones in the current page)
      ids: [] // al the selected product (including the ones not in the curent filter)
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

    async fetchHeaders()
    {
      try
      {
        let response = await axios.get(`${api}/SelectProduct/header`, {responseType: 'json'});
        if (response.status !== 200)
          return MessageServiceTools.httpFail(this.messageService, response);

        this.products.header = response.data;
      } catch (e: any | AxiosError)
      {
        MessageServiceTools.networkError(this.messageService, e.message);
      }
    }

    async fetchFilter()
    {
      try
      {
        let response = await axios.get(`${api}/SelectProduct/filter`, {responseType: 'json'});
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
        let response = await axios.post(`${api}/SelectProduct/filter/execute`, filters, {responseType: 'json'});
        if (response.status !== 200)
          return MessageServiceTools.httpFail(this.messageService, response);

        this.products.filteredIds = response.data;

        await this.loadProductsLazy({first: 0, rows: this.rowsNumber});
      } catch (e: any)
      {
        MessageServiceTools.networkError(this.messageService, e.message);
      }
    }

    async loadProductsLazy(event: LazyLoadEvent)
    {
      this.loading = true;

      try
      {
        const begin: number = event.first ?? 0;
        const end: number = begin + (event.rows ?? 0);

        // get the ids of the products of the page
        const ids = this.products.filteredIds.slice(begin, end);
        const url = UrlBuilder.create(`${api}/SelectProduct/filter/values`).addParam('ids', ids).build();
        const response = await axios.get(url, {responseType: 'json'});
        if (response.status !== 200)
          return MessageServiceTools.httpFail(this.messageService, response);

        // Update the productsPageData
        this.products.pageData = response.data;

        // Update the selected data
        this.selectedProducts.data = this.products.pageData
          .filter((product: any) => this.selectedProducts.ids.includes(product.id));

        this.setDefaultPageData();
      } catch (e: any | AxiosError)
      {
        MessageServiceTools.networkError(this.messageService, e.message);
      }

      this.loading = false;
    }

    // For each data of the page it will set default for some field
    formatData()
    {
      for (const product of this.products.pageData)
      {
        // for (const header of this.discounts.header)
        //   discount[header.field] = ITableData.build(discount[header.field]);

        // if product.photo is null or empty, we set a default image
        if (!product.photo || product.photo === "")
        {
          product.photo = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";

        }
      }
    }

    async editProduct(product: any)
    {
      await this.router.navigate(['../edit/one'], {
        relativeTo: this.route,
        state: {selectedIds: this.selectedProducts.ids, selectedId: product.id}
      });
    }

    async editSelection()
    {
      // go to child route 'edit/multiple'
      await this.router.navigate(['../edit/multiple'], {relativeTo: this.route});
    }*/
}
