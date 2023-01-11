import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {IKeyValueTuple} from "../../selectors/predefined-key-value-table/predefined-key-value-table.component";
import {FeatureModelsService} from "../../../Services/feature-model.service.ts.service";

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

    currentFeatures: IKeyValueTuple[] = [
        {
            model: {id: 1, name: "Couleur"},
            value: {id: 1, name: "Rouge"}
        },
        {
            model: {id: 2, name: "Expédié sous"},
            value: {id: 3, name: "24/48h"}
        }
    ];

    constructor(private featureModelsService: FeatureModelsService)
    {}

    async ngOnInit()
    {
        this.modelSuggestions = await this.featureModelsService.getFeatureModels();
    }

    onValidate()
    {
        this.visible = false;
    }

    async getValuesSuggestions(modelId: number): Promise<IdNameDto[]>
    {
        if (modelId === 1)
        {
            return [
                {id: 1, name: "Rouge"},
                {id: 2, name: "Vert"},
            ];
        }

        if (modelId === 2)
        {
            return [
                {id: 3, name: "24/48h"},
                {id: 4, name: "72h"},
            ];
        }

        return [];
    }
}
