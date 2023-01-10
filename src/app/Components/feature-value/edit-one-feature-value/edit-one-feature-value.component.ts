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
import {ConfirmationServiceTools} from "../../../../utils/ConfirmationServiceTools";
import {Sandbox} from "../../../../utils/Sandbox";
import {ConfirmationService, MessageService} from "primeng/api";
import {PatchFeatureValueDto} from "../../../../Dtos/FeatureDtos/FeatureValueDtos/PatchFeatureValueDto";
import {IdPrestashopShopDto} from "../../../../Dtos/IdPrestashopShopDto";


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

    loading: boolean = false;

    constructor(private http: HttpClientWrapperService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService)

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
        this.initFeatureModel();
    }


    initFeatureModel(): void
    {
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

    // todo does not works the way I want.
    detectChanges(): IChanges
    {
        const [toAdd, toPatch, toDelete] = this.splitChanges();

        // we copy the modified values
        // const currentFeatureValues: FeatureValueDto[] = Operation.deepCopy(toPatch);
        toPatch
            .forEach(value => value.shopSpecifics = value.shopSpecifics.filter(ss => ss.idPrestashop != undefined));

        const changes: IChanges = {diffObj: [], count: 0};

        // for (let i = 0; i < toPatch.length; i++)
        for (const currentFeatureValue of toPatch)
        {
            const initialFeatureValue: FeatureValueDto = Operation.first(this.initialFeatureModel.values,
                v => v.id == currentFeatureValue.id);

            const diff = CheckingTools.detectChanges(currentFeatureValue, initialFeatureValue);
            if (diff.count > 0)
            {
                changes.diffObj.push(diff);
                changes.count++;
            }
        }

        changes.count += toAdd.length;
        changes.count += toDelete.length;

        return changes;
    }

    // split the changes in three parts
    // toAdd, toPatch, toDelete
    // the toPatch should not be
    splitChanges(): [toAdd: FeatureValueDto[], toPatch: FeatureValueDto[], toDelete: FeatureValueDto[]]
    {
        const initialValues: FeatureValueDto[] = this.initialFeatureModel.values;
        const currentValues: FeatureValueDto[] = this.featureModel.values;

        const res: { toAdd: FeatureValueDto[], toPatch: FeatureValueDto[], toDelete: FeatureValueDto[] } = {
            toAdd: currentValues // every value not initially present but now present
                .filter(cr => !initialValues.some(iv => iv.id === cr.id)),
            toPatch: [],
            toDelete: initialValues // every value initially present in but not anymore
                .filter(iv => !currentValues.some(cr => cr.id === iv.id)),
        }

        res.toPatch = currentValues // the rest
            .filter(cr => !res.toAdd.some(va => va.id === cr.id) && !res.toDelete.some(va => va.id === cr.id));

        return [Operation.deepCopy(res.toAdd), Operation.deepCopy(res.toPatch), Operation.deepCopy(res.toDelete)];
    }

    async reset()
    {
        const changes: IChanges = this.detectChanges();
        if (changes.count == 0)
        {
            return this.messageService.add({
                severity: 'info',
                summary: 'Aucun changement',
                detail: 'Aucun changement à abandonner'
            });
        }

        const cancel = await ConfirmationServiceTools.newBlocking(this.confirmationService,
            Sandbox.buildCancelChangeMessage(changes.count));

        if (!cancel)
            return;

        this.initFeatureModel();
    }

    async save()
    {
        const changes = this.detectChanges();
        if (changes.count == 0)
        {
            return this.messageService.add({
                severity: 'info',
                summary: 'Aucun changement',
                detail: 'Aucun changement à enregistrer'
            });
        }

        const register = await ConfirmationServiceTools.newBlocking(this.confirmationService,
            Sandbox.buildRegisterChangeMessage(changes.count));

        if (!register)
            return;

        await this._save(changes);
    }

    private async _save(changes: IChanges)
    {
        this.loading = true;
        const [toAdd, toPatch, toDelete] = this.splitChanges();

        await Promise.all([this._saveAdd(toAdd), this._savePatch(changes, toPatch), this._saveDelete(toDelete)]);

        await this.fetchFeatureModel(this.featureModel.id);
        this.loading = false;
    }

    private async _savePatch(changes: IChanges, toPatch: FeatureValueDto[]): Promise<void>
    {
        const promises: Promise<void>[] = [];
        console.log(changes);
        for (const change of changes.diffObj)
        {
            // console.log(change)
        }
        // promises.push(this._savePatchOne(featureValue));
        await Promise.all(promises);
    }

    private async _savePatchOne(featureValue: FeatureValueDto): Promise<void>
    {
        const patch: PatchFeatureValueDto = {
            id: featureValue.id,
            value: featureValue.value
        };
        let response = await this.http.patch(`${api}/featureValue`, patch);
        if (!HttpTools.IsValid(response.status))
        {
            return this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Erreur lors de la mise à jour de la valeur ${featureValue.value}`
            });
        }

        response = await this.http.patch(`${api}/featureValue/shopSpecifics`, patch);
        if (!HttpTools.IsValid(response.status))
        {
            return this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Erreur lors de la mise à jour de la valeur ${featureValue.value}`
            });
        }
    }


    private async _saveAdd(toAdd: FeatureValueDto[]): Promise<void>
    {
        const promises: Promise<void>[] = [];
        for (const featureValue of toAdd)
            promises.push(this._saveAddOne(featureValue));
        await Promise.all(promises);
    }

    private async _saveAddOne(featureValue: FeatureValueDto): Promise<void>
    {
        let response = await this.http.post(`${api}/featureValue`, {
            featureModelId: this.featureModel.id,
            value: featureValue.value
        });
        if (!HttpTools.IsValid(response.status))
        {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Erreur lors de l'ajout de la valeur ${featureValue.value}`
            });
        }

        const shopSpecifics: IdPrestashopShopDto[] = featureValue.shopSpecifics
            .filter(ss => ss.idPrestashop != undefined);
        if (shopSpecifics.length == 0)
            return

        const featureValueId = response.body;
        response = await this.http.post(`${api}/featureValue/shopSpecific/${featureValueId}`, shopSpecifics);
        if (!HttpTools.IsValid(response.status))
        {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Erreur lors de l'ajout des identifiants à la valeur ${featureValue.value}`
            });
        }
    }

    private async _saveDelete(toDelete: FeatureValueDto[]): Promise<void>
    {
        const promises: Promise<void>[] = [];
        for (const featureValue of toDelete)
            promises.push(this._saveDeleteOne(featureValue));
        await Promise.all(promises);
    }

    private async _saveDeleteOne(featureValue: FeatureValueDto): Promise<void>
    {
        const response = await this.http.delete(`${api}/featureValue/${featureValue.id}`);
        if (!HttpTools.IsValid(response.status))
        {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Erreur lors de la suppression de la valeur ${featureValue.value}`
            });
        }
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
