import {Component, OnInit} from '@angular/core';
import {FeatureModelDto} from "../../../../Dtos/FeatureDtos/FeatureModelDtos/FeatureModelDto";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {Shop} from "../../../../Enums/Shop";
import {Operation} from "../../../../utils/Operation";
import {FeatureValueDto} from "../../../../Dtos/FeatureDtos/FeatureValueDtos/FeatureValueDto";
import {IChanges} from "../../../../Interfaces/IChanges";
import {CheckingTools} from "../../../../utils/CheckingTools";
import {NullablePropertyWrapperDto} from "../../../../Dtos/NullablePropertyWrapperDto";


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
    initialFeatureModel: FeatureModelDto;

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

        this.initialFeatureModel = response.body;
        this.featureModel = Operation.deepCopy(this.initialFeatureModel);

        // for each value create the shop present in featureModel but not in the value
        const featureModelShops: Shop[] = this.featureModel.shopSpecifics.map(ss => ss.shop);
        for (const value of this.featureModel.values)
        {
            const missingShop: Shop[] = featureModelShops
                .filter(shop => !value.shopSpecifics.some(ss => ss.shop == shop));

            // we set to undefined the new one
            value.shopSpecifics = value.shopSpecifics // @ts-ignore
                .concat(missingShop.map(shop => ({idPrestashop: undefined, shop: shop})))
                .sort((a, b) => a.shop - b.shop);
        }
    }

    detectChanges(): IChanges
    {
        // we copy the modified values
        const currentFeatureValues: FeatureValueDto[] = Operation.deepCopy(this.featureModel.values);

        // we remove the undefined because we don't save them in the database
        currentFeatureValues
            .forEach(value => value.shopSpecifics = value.shopSpecifics.filter(ss => ss.idPrestashop != undefined));

        const changes: IChanges = {diffObj: [], count: 0};

        for (let i = 0; i < this.initialFeatureModel.values.length; i++)
        {
            const initialFeatureValue: FeatureValueDto = this.initialFeatureModel.values[i];
            const currentFeatureValue: FeatureValueDto = currentFeatureValues[i];

            const diff = CheckingTools.detectChanges(currentFeatureValue, initialFeatureValue);
            if (diff.count > 0)
            {
                changes.diffObj.push(diff);
                changes.count++;
            }
        }

        return changes;
    }

    // split the changes in three parts
    // toAdd, toPatch, toDelete
    // the toPatch should not be
    splitChanges(): { toAdd: FeatureValueDto[], toPatch: FeatureValueDto[], toDelete: FeatureValueDto[] }
    {
        const initialValues: FeatureValueDto[] = this.initialFeatureModel.values;
        const currentValues: FeatureValueDto[] = this.featureModel.values;

        const res = {
            toAdd: currentValues // every value not initially present but now present
                .filter(cr => !initialValues.some(iv => iv.id == cr.id)),
            toPatch: [],
            toDelete: initialValues // every value initially present in but not anymore
                .filter(iv => !currentValues.some(cr => cr.id == iv.id)),
        }

        // @ts-ignore
        res.toPatch = currentValues // the rest
            .filter(cr => !res.toAdd.some(va => va.id != cr.id) && !res.toDelete.some(va => va.id != cr.id));

        return res;
    }

    reset()
    {

    }

    save()
    {
        const changes = this.detectChanges();
        console.log(changes);
    }

    get Shop(): typeof Shop
    {
        return Shop;
    }

    // return all the shop that the model is on
    getModelShops(): Shop[]
    {
        return this.featureModel.shopSpecifics.map(shop => shop.shop);
    }

    deleteValue(featureValue: FeatureValueDto)
    {
        // remove featureValue (by id) in this.featureModel.values
        this.featureModel.values = this.featureModel.values.filter(value => value !== featureValue);
    }

    createEmptyValue()
    {
        this.featureModel.values.push(
            {
                id: -1,
                name: '',  // @ts-ignore
                shopSpecifics: this.featureModel.shopSpecifics
                    .map(ss => { return {idPrestashop: undefined, shop: ss.shop} })
            }
        )
    }
}
