import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {DataTableVector} from "../../filter/filter-table/filter-table.component";
import {FieldType} from "../../../../Enums/FieldType";
import {MessageService} from "primeng/api";

import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {IEnumerableToITableData} from "../../../../Interfaces/ITableData";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";

@Component({
  selector: 'app-distributor-filter',
  templateUrl: './distributor-filter.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    '../../../../styles/main-color-background.css',
    './distributor-filter.component.css'
  ]
})
export class DistributorFilterComponent implements OnInit
{
  loading = true;

  // there because we load everything once
  fullData: IdNameDto[] = [];

  distributors: DataTableVector =
    {
      header: [],
      pageData: [], // The data of the current page.
      filteredIds: [], // The id of every data matching the filter.
      // So data of every page of the tab.
    };

  constructor(private messageService: MessageService,
              private http: HttpClientWrapperService)
  {}

  async ngOnInit(): Promise<void>
  {
    this.fetchHeaders();
    await this.applyFilters()
    await this.loadLazy({first: 0, rows: 50});
    this.loading = false;
  }

  fetchHeaders()
  {
    this.distributors.header = [
      {
        field: 'id',
        label: 'Id',
        type: FieldType.Integer,
      },
      {
        field: 'name',
        label: 'Nom',
        type: FieldType.None,
      }
    ]
  }

  editDistributor(event: any): boolean
  {
    this.messageService.add({
      severity: 'warn', summary: 'Oups',
      detail: "La modification des distributeurs n'est pas encore disponible"
    });
    return false;
  }

  async loadLazy(event: any): Promise<void>
  {
    const begin: number = event.first ?? 0;
    const end: number = begin + (event.rows ?? 0);

    this.distributors.pageData = this.formatData(this.fullData.slice(begin, end));
  }

  // no filter for this screen but keep the same structure
  async applyFilters(): Promise<void>
  {
      const response = await this.http.get(`${api}/distributor`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response.body);

      this.fullData = response.body;
  }

  formatData(datas: IdNameDto[]): IEnumerableToITableData[]
  {
    const res: IEnumerableToITableData[] = []; // row1, row2, ...
    for (const data of datas)
    {
      let row: IEnumerableToITableData = {id: data.id}; // id, name, ...
      for (const header of this.distributors.header)
      {
        const field = header.field;
        // @ts-ignore
        row[field] = {value: data[field], tooltip: ''};
      }
      res.push(row);
    }

    return res;
  }
}
