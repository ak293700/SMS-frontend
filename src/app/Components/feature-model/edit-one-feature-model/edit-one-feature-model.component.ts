import {Component, OnInit} from '@angular/core';
import {Operation} from "../../../../utils/Operation";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {FeatureModelsService} from "../../../Services/feature-model.service.ts.service";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {ConfirmationService, MenuItem, MessageService, PrimeIcons} from "primeng/api";
import {IChanges} from "../../../../Interfaces/IChanges";
import {Shop} from "../../../../Enums/Shop";
import {CheckingTools} from "../../../../utils/CheckingTools";
import {ConfirmationServiceTools} from "../../../../utils/ConfirmationServiceTools";
import {Router} from "@angular/router";
import {LiteFeatureModelDto} from "../../../../Dtos/FeatureDtos/FeatureModelDtos/LiteFeatureModelDto";
import {Sandbox} from "../../../../utils/Sandbox";


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
    // @ts-ignore
    initialFeatureModel: LiteFeatureModelDto;
    // @ts-ignore
    featureModel: LiteFeatureModelDto;

    otherFeatureModels: IdNameDto[] = [];

    loading: boolean = false;

    dialItems: MenuItem[];

    newShopStruct: {
        visible: boolean,
        forbiddenShops: Shop[],
    } = {
        visible: false,
        forbiddenShops: []
    }

    constructor(private featureModelService: FeatureModelsService,
                private http: HttpClientWrapperService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router)
    {
        this.dialItems = [
            {
                icon: PrimeIcons.TRASH,
                command: () => this.delete()
            },
            {
                icon: PrimeIcons.UPLOAD,
                command: () => this.forcePrestaPush()
            },
            {
                icon: PrimeIcons.REFRESH,
                command: () => this.refresh()
            },
            {
                icon: PrimeIcons.PLUS,
                command: () => this.newShopSpecificRequest()
            },
        ];
    }

    async ngOnInit()
    {
        const routedData: { selectedIds: number[], selectedId: number } = history.state;
        if (routedData.selectedIds == undefined)
            routedData.selectedIds = [47, 1, 2, 34, 14];

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
        const response = await this.http.get(`${api}/featureModel/${id}/lite`);
        if (!HttpTools.IsValid(response.status))
            return MessageServiceTools.httpFail(this.messageService, response);

        this.initialFeatureModel = response.body;
        this.featureModel = Operation.deepCopy(this.initialFeatureModel);
    }

    detectChanges(): IChanges
    {
        return CheckingTools.detectChanges(this.featureModel, this.initialFeatureModel, ['id']);
    }

    private async _save(changes: IChanges)
    {
        this.loading = true;

        try
        {

            // if edit shop specifics
            if (changes.diffObj.shopSpecifics != undefined)
            {
                // then send the whole object to set to exactly that
                const response = await this.http.post(`${api}/featureModel/shopSpecific/${this.featureModel.id}`,
                    this.featureModel.shopSpecifics);

                if (!HttpTools.IsValid(response.status))
                    return MessageServiceTools.httpFail(this.messageService, response);

                // remove shop specific so it not in the next part
                delete changes.diffObj.shopSpecifics;
                changes.count--;
            }

            if (changes.count !== 0)
            {
                // the id is already contain
                const response = await this.http.patch(`${api}/featureModel/`, changes.diffObj);
                if (!HttpTools.IsValid(response.status))
                    return MessageServiceTools.httpFail(this.messageService, response);
            }

            this.messageService.add({
                severity: 'success',
                summary: 'Enregistrer',
                detail: 'La caractéristique a bien été enregistré'
            });

            // re fetch to be sure that everything works and is synchronized
            await this.fetchFeatureModel(this.featureModel.id);
        } finally
        {
            this.loading = false;
        }
    }

    save()
    {
        const changes = this.detectChanges();
        if (changes.count == 0)
            return this.messageService.add({severity: 'info', summary: 'Enregistrer', detail: 'Aucune modification'});

        ConfirmationServiceTools.new(this.confirmationService,
            this,
            this._save,
            `Toute donnée modifiée ne pourra être retrouvé. ${changes.count} modifications.`,
            changes);
    }

    reset()
    {
        this.featureModel = Operation.deepCopy(this.initialFeatureModel);

        this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Modification annulée'});
    }

    get Shop(): typeof Shop
    {
        return Shop;
    }

    private async delete()
    {
        if (!await ConfirmationServiceTools.newBlocking(this.confirmationService,
            "Êtes-vous sur de supprimer ce produit ? Cette action est irréversible !"))
            return;

        const response = await this.http.delete(`${api}/featureModel/${this.featureModel.id}`);
        if (!HttpTools.IsValid(response.status))
            return MessageServiceTools.httpFail(this.messageService, response);

        // remove this product from the list
        this.otherFeatureModels = this.otherFeatureModels.filter(p => p.id != this.featureModel.id);

        if (this.otherFeatureModels.length > 0)
            await this.fetchFeatureModel(this.otherFeatureModels[0].id);
        else
            await this.router.navigate(['/product/filter']);
    }

    private forcePrestaPush()
    {
        this.messageService
            .add({severity: 'warn', summary: 'Oups', detail: "Cette fonctionnalité n'est pas encore implémentée"});
    }

    private async refresh()
    {
        this.loading = true;
        await this.fetchAll(this.otherFeatureModels.map((e: IdNameDto) => e.id));
        await this.fetchFeatureModel(this.featureModel.id)
        this.loading = false;
    }

    private newShopSpecificRequest()
    {
        // filter, so it keep only the shop that are not already created
        this.newShopStruct.forbiddenShops = this.featureModel.shopSpecifics.map(ss => ss.shop);
        this.newShopStruct.visible = true;
    }

    async editValues()
    {
        const changes = this.detectChanges();
        if (changes.count != 0)
        {
            await ConfirmationServiceTools.newBlocking(this.confirmationService,
                Sandbox.buildCancelChangeMessage(changes.count));
        }

        await this.router.navigate(['/featureValue/edit/one'], {
            state: {
                featureModelId: this.featureModel.id
            }
        });
    }

    createNewShopSpecific(selectedShop: IdNameDto)
    {
        this.featureModel.shopSpecifics.push({idPrestashop: null, shop: selectedShop.id});
    }
}
