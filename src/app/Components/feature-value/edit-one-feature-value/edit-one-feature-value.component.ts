import {Component, OnInit} from '@angular/core';
import {FeatureModelDto} from "../../../../Dtos/FeatureDtos/FeatureModelDtos/FeatureModelDto";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";

@Component({
    selector: 'app-edit-one-feature-value',
    templateUrl: './edit-one-feature-value.component.html',
    styleUrls: [
        '../../../../styles/main-color-background.css',
        '../../../../styles/button.css',
        './edit-one-feature-value.component.css'
    ]
})
export class EditOneFeatureValueComponent implements OnInit
{
    // @ts-ignore
    featureModel: FeatureModelDto;

    constructor(private http: HttpClientWrapperService)
    {}

    async ngOnInit()
    {
        const routedData: { featureModelId: number } = history.state;
        if (routedData.featureModelId == undefined)
            routedData.featureModelId = 47;

        await this.fetchFeatureModel(routedData.featureModelId);
    }

    async fetchFeatureModel(id: number): Promise<void>
    {
        const response = await this.http.get(`${api}/featureModel/${id}`);
        if (!HttpTools.IsValid(response.status))
            return;

        this.featureModel = response.body;
        console.log(this.featureModel);
    }


    reset()
    {

    }

    save()
    {

    }
}
