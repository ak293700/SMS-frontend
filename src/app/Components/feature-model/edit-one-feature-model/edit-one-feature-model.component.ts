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

        console.log(this.featureModel);

        // this.initDummyStruct();
    }

    detectChanges(): IChanges
    {
        return CheckingTools.detectChanges(this.featureModel, this.initialFeatureModel);
    }

    save()
    {
        const changes = this.detectChanges();
        if (changes.count == 0)
        {
            this.messageService.add({severity: 'info', summary: 'Enregistrer', detail: 'Aucune modification'});
            return
        }
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
        this.messageService
            .add({severity: 'warn', summary: 'Oups', detail: "Cette fonctionnalité n'est pas encore implémentée"});
    }

    async editValues()
    {
        const changes = this.detectChanges();
        if (changes.count != 0)
        {
            await ConfirmationServiceTools.newBlocking(this.confirmationService,
                `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment les abandonner ?`);
        }

        await this.router.navigate(['/featureValue/edit/one'], {
            state: {
                featureModelId: this.featureModel.id
            }
        });
    }
}
