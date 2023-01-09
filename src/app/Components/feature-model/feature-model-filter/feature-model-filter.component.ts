import {Component, OnInit} from '@angular/core';
import {DataTableVector, SelectedData} from "../../filter/filter-table/filter-table.component";

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

    constructor()
    {
    }

    ngOnInit(): void
    {
    }

    editFeatureModel(featureModel: any)
    {
        console.log('editFeatureModel')
        console.log(featureModel);
    }
}
