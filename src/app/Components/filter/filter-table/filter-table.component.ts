import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MenuItem} from "primeng/api";
import {IHeader} from "../../../../Dtos/IHeader";
import {IEnumerableToITableData} from "../../../../Interfaces/ITableData";

export interface DataTableVector
{
  header: IHeader[];
  pageData: IEnumerableToITableData[]; // ex: pageData['id'] = {value: 1, tooltip: 'tooltip'}
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
  @Input() isPhoto: boolean = false;
  @Input() contextMenuItems: MenuItem[] = [];
  @Output('onLazyLoad') lazyLoadEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output('onEditData') editDataEvent: EventEmitter<any> = new EventEmitter<any>();

  contextMenuSelectedProduct: any;

  @Input() datas: DataTableVector =
    {
      header: [],
      pageData: [], // The data of the current page.
      filteredIds: [], // The id of every data matching the filter.
      // So data of every page of the tab.
    };

  rowsNumber: number = 50;

  @Input() selectedDatas: any = {
    data: [], // the selected product (only the ones in the current page)
    ids: [] // al the selected product (including the ones not in the curent filter)
  };
  areAllSelected: boolean = false;

  totalRecords: number = 0;

  // boolean
  @Input() loading: boolean = true;

  // Private we use getter and setter to manipulate it.
  _displayedHeader = this.datas.header;

  constructor()
  {
    this.contextMenuItems = [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.editProduct(this.contextMenuSelectedProduct)
      }
    ];

    this.selectedDatas = {header: [], pageData: [], filteredIds: []}
  }

  ngOnInit()
  {
    this.initFields();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    this.initFields();
  }

  initFields()
  {
    this._displayedHeader = this.datas.header;
    this.totalRecords = this.datas.filteredIds.length;
  }

  onRowSelect(event: any)
  {
    this.selectedDatas.ids.push(event.data.id);

    // If there is at least enough product selected that product find
    if (this.selectedDatas.ids.length >= this.datas.filteredIds.length)
    {
      // Need to check that all the product are selected
      for (let i = 0; i < this.datas.filteredIds.length; i++)
      {
        if (!this.selectedDatas.ids.includes(this.datas.filteredIds[i]))
          return;
      }

      this.areAllSelected = true;
    }
  }

  onRowUnselect(event: any)
  {
    // console.log(event.data.id);
    this.selectedDatas.ids = this.selectedDatas.ids.filter((id: number) => id !== event.data.id);
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
    this.selectedDatas.data = this.datas.pageData;

    // Get all ids that where unselected
    const newIds = this.datas.filteredIds
      .filter((id: number) => !this.selectedDatas.ids.includes(id));

    // concat the ids of the selected products
    this.selectedDatas.ids = this.selectedDatas.ids.concat(newIds);

  }

  onUnselectAll()
  {
    this.areAllSelected = false;

    this.selectedDatas.ids =
      this.selectedDatas.ids.filter((id: number) => !this.datas.filteredIds.includes(id));


    this.selectedDatas.data = [];
  }

  get displayedHeader(): any[]
  {
    // remove @Input() from function signature
    return this._displayedHeader;
  }

  set displayedHeader(val: any[])
  {
    // restore original order
    this._displayedHeader = this.datas.header
      .filter((col: any) => val.includes(col));
  }

  unselectAll()
  {
    this.selectedDatas.ids = [];
    this.selectedDatas.data = [];
    this.areAllSelected = false;
  }

  editProduct(product: any)
  {
    // console.log('edit product', product);
    this.editDataEvent.emit(product);
  }
}
