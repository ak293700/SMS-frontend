import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {Operation} from "../../../../utils/Operation";

/*
* Ce composant permet d'éditer (ajouter, supprimer, éditer, ...) une collection de clé/valeur prédéfinie.
*/

export interface IKeyValueTuple
{
    model: IdNameDto,
    value: IdNameDto
}


@Component({
    selector: 'app-predefined-key-value-table',
    templateUrl: './predefined-key-value-table.component.html',
    styleUrls: [
        '../../../../styles/button.css',
        './predefined-key-value-table.component.css'
    ]
})
export class PredefinedKeyValueTableComponent implements OnChanges
{
    @Input('keySuggestions') initialKeySuggestions: IdNameDto[] = [];
    keySuggestions: IdNameDto[] = [];

    // for each model we have a list of values
    private _valueSuggestions: { [key: number]: IdNameDto[] } = {};

    // we can have only one value suggestion because
    // the user click only on one dropdown at the time
    valueSuggestion: IdNameDto[] = [];

    @Input() getValuesSuggestions: (modelId: number) => Promise<IdNameDto[]> =
        (modelId: number) => Promise.resolve([]);

    @Input() currentTuples: IKeyValueTuple[] = [];
    @Output() currentTuplesChange = new EventEmitter<IKeyValueTuple[]>();

    constructor()
    {}

    async ngOnChanges(changes: SimpleChanges)
    {
        if (changes.hasOwnProperty('keySuggestions'))
        {
            this.initialKeySuggestions = changes['keySuggestions'].currentValue;
            this.keySuggestions = Operation.deepCopy(this.initialKeySuggestions);
        }
    }

    createEmptyValue()
    {
        this.currentTuples.push({
            model: {id: -1, name: ""},
            value: {id: -1, name: ""}
        });
    }

    deleteValue(currentFeature: IKeyValueTuple)
    {
        this.currentTuples = this.currentTuples.filter(f => f !== currentFeature);
    }

    completeMethodForModel(event: any)
    {
        this.keySuggestions = Operation.completeMethod(event.query, this.initialKeySuggestions);
    }

    async completeMethodForValue(event: any, modelId: number)
    {
        let suggestions = this._valueSuggestions[modelId];
        if (suggestions == undefined)
        {
            // if we do not have the value we fetch them
            suggestions = await this.getValuesSuggestions(modelId);
            this._valueSuggestions[modelId] = suggestions;
        }

        this.valueSuggestion = Operation.completeMethod(event.query, suggestions);
    }

    onKeyChange(currentTuple: IKeyValueTuple)
    {
        currentTuple.value = {id: -1, name: ""};
        this.currentTuplesChange.emit(this.currentTuples);
    }

    onValueChange()
    {
        this.currentTuplesChange.emit(this.currentTuples);
    }
}
