import {Component, OnInit} from '@angular/core';
import {DataTableVector, SelectedData} from "../../filter/filter-table/filter-table.component";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {FieldType} from "../../../../Enums/FieldType";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {FilterFieldsComponent} from "../../filter/filter-fields/filter-fields.component";
import {UrlBuilder} from "../../../../utils/UrlBuilder";
import {IEnumerableToITableData, ITableData} from "../../../../Interfaces/ITableData";
import {FilterTableProductDto} from "../../../../Dtos/ProductDtos/FilterTableProductDto";


@Component({
    selector: 'app-feature-model-filter',
    templateUrl: './feature-model-filter.component.html',
    styleUrls: [
        '../../../../styles/main-color-background.css',
        '../../../../styles/button.css',
        './feature-model-filter.component.css'
    ]
})
export class FeatureModelFilterComponent implements OnInit
{
    filters: any[] = [];
    featureModels: DataTableVector =
        {
            header: [],
            pageData: [], // The products of the current page.
            filteredIds: [], // The id of every product matching the filter.
            // So product of every page of the tab
        };

    rowsNumber: number = 50;
    selectedFeatureModels: SelectedData = {
        data: [],
        ids: []
    }
    loading: boolean = true;

    constructor(private http: HttpClientWrapperService,
                private messageService: MessageService)
    {
    }

    async ngOnInit(): Promise<void>
    {
        this.fetchHeaders();
        await this.fetchFilter();
        await this.applyFilters();
    }

    private fetchHeaders()
    {
        this.featureModels.header = [
            {
                label: 'Nom',
                field: 'name',
                type: FieldType.None
            },
            {
                label: 'Nombre de valeur',
                field: 'numberOfValues',
                type: FieldType.Integer
            }
        ];
    }

    private async fetchFilter()
    {
        const response = await this.http.get(`${api}/SelectFeatureModel/filter`);
        if (!HttpTools.IsValid(response.status))
            MessageServiceTools.httpFail(this.messageService, response);

        this.filters = response.body;
        FilterFieldsComponent.setDefaultFilterValue(this.filters);
    }

    async applyFilters()
    {
        let filters = this.filters.filter(filter => filter.active);
        const response = await this.http.post(`${api}/SelectFeatureModel/filter/execute`, filters);
        if (!HttpTools.IsValid(response.status))
            MessageServiceTools.httpFail(this.messageService, response);

        this.featureModels.filteredIds = response.body;

        await this.loadLazy({first: 0, rows: this.rowsNumber});
    }

    async loadLazy(event: LazyLoadEvent)
    {
        this.loading = true;

        const begin: number = event.first ?? 0;
        const end: number = begin + (event.rows ?? 0);

        // get the ids of the products of the page
        const ids = this.featureModels.filteredIds.slice(begin, end);
        const url = UrlBuilder.create(`${api}/SelectFeatureModel/filter/values`).addParam('ids', ids).build();
        const response = await this.http.get(url);
        if (!HttpTools.IsValid(response.status))
            MessageServiceTools.httpFail(this.messageService, response);

        console.log(response.body);

        // Update the productsPageData
        this.featureModels.pageData = this.formatData(response.body);

        // Update the selected data
        this.selectedFeatureModels.data = this.featureModels.pageData
            .filter((product: IEnumerableToITableData) => this.selectedFeatureModels.ids.includes(product.id));

        this.loading = false;
    }

    formatData(datas: FilterTableProductDto[]): IEnumerableToITableData[]
    {
        const res: IEnumerableToITableData[] = []; // row1, row2, ...
        for (const data of datas)
        {
            let row: IEnumerableToITableData = {id: data.id}; // id, name, ...
            for (const header of this.featureModels.header)
            {
                const field = header.field;
                row[field] = ITableData.build(data[field]);
            }
            res.push(row);
        }

        return res;
    }

    editFeatureModel(featureModel: any)
    {
        console.log('editFeatureModel')
        console.log(featureModel);
    }
}
