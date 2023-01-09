import {Component, OnInit} from '@angular/core';
import {Operation} from "../../../../utils/Operation";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {FeatureModelsService} from "../../../Services/feature-model.service.ts.service";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {MessageService} from "primeng/api";
import {IChanges} from "../../../../Interfaces/IChanges";

@Component({
    selector: 'app-edit-one-feature-model',
    templateUrl: './edit-one-feature-model.component.html',
    styleUrls: [
        '../../../../styles/main-color-background.css',
        '../../../../styles/button.css',
        './edit-one-feature-model.component.css'
    ]
})
export class EditOneFeatureModelComponent implements OnInit
{
    initialFeatureModel: any;
    featureModel: any;

    otherFeatureModels: IdNameDto[] = [];

    loading: boolean = false;

    constructor(private featureModelService: FeatureModelsService,
                private http: HttpClientWrapperService,
                private messageService: MessageService)
    {}

    async ngOnInit()
    {
        let routedData: { selectedIds: number[], selectedId: number } = history.state;
        if (routedData.selectedIds == undefined)
            routedData.selectedIds = [1, 2, 34];

        if (routedData.selectedId == undefined)
            routedData.selectedId = Operation.firstOrDefault(routedData.selectedIds) ?? 0;

        // push at the beginning of the array
        if (!routedData.selectedIds.includes(routedData.selectedId))
            routedData.selectedIds.unshift(routedData.selectedId);

        await this.fetchAll(routedData.selectedIds);
        await this.fetchFeatureModel(routedData.selectedId);
    }

    async fetchAll(ids: number[])
    {
        const allModels: IdNameDto[] = await this.featureModelService.getFeatureModels();

        this.otherFeatureModels = allModels
            .filter((e: IdNameDto) => ids.includes(e.id))
            .sort((a: IdNameDto, b: IdNameDto) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }

    async fetchFeatureModel(id: number)
    {
        const response = await this.http.get(`${api}/featureModel/${id}`);
        if (!HttpTools.IsValid(response.status))
            return MessageServiceTools.httpFail(this.messageService, response);

        this.initialFeatureModel = response.body;
        this.featureModel = Operation.deepCopy(this.initialFeatureModel);

        // this.initDummyStruct();
    }

    detectChanges(): IChanges
    {
        return {diffObj: {}, count: 0}
    }

    save()
    {

    }

    reset()
    {

    }
}
