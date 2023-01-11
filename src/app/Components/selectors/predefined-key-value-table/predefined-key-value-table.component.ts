import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {FeatureModelsService} from "../../../Services/feature-model.service.ts.service";
import {Operation} from "../../../../utils/Operation";

/*
* Ce composant permet d'éditer (ajouter, supprimer, éditer, ...) une collection de clé/valeur prédéfinie.
*/

@Component({
    selector: 'app-predefined-key-value-table',
    templateUrl: './predefined-key-value-table.component.html',
    styleUrls: [
        '../../../../styles/button.css',
        './predefined-key-value-table.component.css'
    ]
})
export class PredefinedKeyValueTableComponent implements OnInit
{

    initialKeySuggestions: IdNameDto[] = [];
    keySuggestions: IdNameDto[] = this.initialKeySuggestions;

    // for each model we have a list of values
    private _valueSuggestions: { [key: number]: IdNameDto[] } = {};

    // we can have only one value suggestion because
    // the user click only on one dropdown at the time
    valueSuggestion: IdNameDto[] = [];

    currentFeatures: {
        model: IdNameDto,
        value: IdNameDto
    }[] = [];

    constructor(private featureModelsService: FeatureModelsService)
    {
        this.initialKeySuggestions = [
            {id: 1, name: "Couleur"},
            {id: 2, name: "Expédié sous"},
        ];

        this.keySuggestions = Operation.deepCopy(this.initialKeySuggestions);

        this.currentFeatures = [
            {
                model: {id: 1, name: "Couleur"},
                value: {id: 1, name: "Rouge"}
            },
            {
                model: {id: 2, name: "Expédié sous"},
                value: {id: 3, name: "24/48h"}
            }
        ];

        this._valueSuggestions[1] = [
            {id: 1, name: "Rouge"},
            {id: 2, name: "Vert"},
        ];

        this._valueSuggestions[2] = [
            {id: 3, name: "24/48h"},
            {id: 4, name: "7j"},
        ];
    }

    async ngOnInit()
    {
        this.keySuggestions = await this.featureModelsService.getFeatureModels();
    }

    createEmptyValue()
    {

    }

    deleteValue(featureValue: any)
    {

    }

    completeMethodForModel(event: any)
    {
        this.keySuggestions = Operation.completeMethod(event.query, this.initialKeySuggestions);
    }

    completeMethodForValue(event: any, modelId: number)
    {
        console.log(modelId);

        let suggestions = this._valueSuggestions[modelId];
        if (suggestions == undefined)
        {
            // fetch it
            suggestions = [];
        }

        console.log(suggestions);

        this.valueSuggestion = Operation.completeMethod(event.query, suggestions);
    }
}
