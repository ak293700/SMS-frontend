import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {IKeyValueTuple} from "../../selectors/predefined-key-value-table/predefined-key-value-table.component";
import {FeatureModelsService} from "../../../Services/feature-model.service.ts.service";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageService} from "primeng/api";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {api} from "../../../GlobalUsings";

@Component({
    selector: 'app-edit-product-features',
    templateUrl: './edit-product-features.component.html',
    styleUrls: [
        '../../../../styles/button.css',
        './edit-product-features.component.css'
    ]
})
export class EditProductFeaturesComponent implements OnInit
{
    visible: boolean = true;

    modelSuggestions: IdNameDto[] = [
        {id: 1, name: "Couleur"},
        {id: 2, name: "Expédié sous"},
    ];

    currentFeatures: IKeyValueTuple[] = [];

    constructor(private featureModelsService: FeatureModelsService,
                private http: HttpClientWrapperService,
                private messageService: MessageService)
    {}

    async ngOnInit()
    {
        this.modelSuggestions = await this.featureModelsService.getFeatureModels();

        this.currentFeatures.push({model: this.modelSuggestions[0], value: {id: -1, name: ""}});
        this.currentFeatures.push({model: this.modelSuggestions[1], value: {id: -1, name: ""}});
    }

    onValidate()
    {
        this.visible = false;
    }

    async getValuesSuggestions(modelId: number): Promise<IdNameDto[]>
    {
        const response = await this.http.get(`${api}/featureValue/${modelId}`);
        if (!HttpTools.IsValid(response.status))
        {
            MessageServiceTools.httpFail(this.messageService, response);
            return [];
        }

        return response.body;
    }
}
