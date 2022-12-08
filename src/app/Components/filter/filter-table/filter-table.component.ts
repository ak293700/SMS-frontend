import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {HeaderDto} from "../../../../Dtos/HeaderDto";

interface DataTableVector
{
  header: HeaderDto[];
  pageData: any[];
  filteredIds: number[];
}

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: [
    './filter-table.component.css',
    '../../../../styles/button.css'
  ]
})
export class FilterTableComponent implements OnInit, OnChanges
{
  @Input() contextMenuItems: MenuItem[] = [];
  @Output('onLazyLoad') lazyLoadEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output('onEditData') editDataEvent: EventEmitter<any> = new EventEmitter<any>();

  contextMenuSelectedProduct: any;

  @Input() products: DataTableVector =
    {
      header: [],
      pageData: [], // The data of the current page.
      filteredIds: [], // The id of every data matching the filter.
      // So data of every page of the tab.
    };

  rowsNumber: number = 50;

  selectedProducts: any = {
    data: [], // the selected product (only the ones in the current page)
    ids: [] // al the selected product (including the ones not in the curent filter)
  };
  areAllSelected: boolean = false;

  totalRecords: number = 0;

  // boolean
  @Input() loading: boolean = true;

  // Private we use getter and setter to manipulate it.
  _displayedProductHeader = this.products.header;

  constructor()
  {
    this.contextMenuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.editProduct(this.contextMenuSelectedProduct)
      }
    ];
  }

  ngOnInit()
  {
    this._displayedProductHeader = this.products.header;
    this.totalRecords = this.products.filteredIds.length;
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    console.log(changes);
    this._displayedProductHeader = this.products.header;
    this.totalRecords = this.products.filteredIds.length;

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

  async loadProductsLazy(event: LazyLoadEvent)
  {
    this.lazyLoadEvent.emit(event);
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

  unselectAll()
  {
    this.selectedProducts.ids = [];
    this.selectedProducts.data = [];
    this.areAllSelected = false;
  }

  editProduct(product: any)
  {
    this.editDataEvent.emit(product);
  }
}
