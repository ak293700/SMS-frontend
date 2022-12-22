import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ProductReferencesService} from "../../../Services/product-references.service";
import {ProductPopularity} from "../../../../Enums/ProductPopularity";
import {Operation} from "../../../../utils/Operation";
import {OperationEnum} from "../../../../Enums/OperationEnum";
import {MenuItem, MessageService} from "primeng/api";
import {GetDiscountsService} from "../../../Services/get-discounts.service";
import {CommonRequestService} from "../../../Services/common-request.service";
import {ChangeType} from "../../../../Enums/ChangeType";
import {ProductChangesResponseDto} from "../../../../Dtos/ProductChangesDtos/ProductChangesResponseDto";
import axios, {AxiosError} from "axios";
import {api} from "../../../GlobalUsings";
import {ProductChangesRequestDto} from "../../../../Dtos/ProductChangesDtos/ProductChangesRequestDto";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {MyConfirmationService} from "../../../Services/my-confirmation.service";
import {Shop} from "../../../../Enums/Shop";

interface Field
{
  value: any;
  active: boolean;
  other?: any;
}


@Component({
  selector: 'app-edit-multiple-products',
  templateUrl: './edit-multiple-products.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    './edit-multiple-products.component.css'
  ],
  providers: [ProductReferencesService, GetDiscountsService,
    CommonRequestService, MyConfirmationService]
})
export class EditMultipleProductsComponent implements OnInit
{
  otherProducts: IdNameDto[] = [];
  allProductReferences: IdNameDto[] = [];

  initialAdditionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
    availabilities: IdNameDto[],
    discounts: IdNameDto[]
  } = {
    manufacturers: [],
    popularities: [],
    availabilities: [],
    discounts: []
  };

  additionalInformation = this.initialAdditionalInformation;

  // @ts-ignore
  dS: {
    manufacturer: Field, popularity: Field,
    availability: Field, km: Field, discount: Field,
    availableDiscounts: Field, promo: Field
  };

  discountContextMenuItems: MenuItem[] = [];
  discountOverlayVisible: boolean = false;

  loading: boolean = false;

  chosenWebsiteChoices: string[];
  chosenWebsite: string;

  constructor(private productReferencesService: ProductReferencesService,
              private getDiscountsService: GetDiscountsService,
              private commonRequest: CommonRequestService,
              private messageService: MessageService,
              private myConfirmationService: MyConfirmationService)
  {
    this.loading = true;
    this.chosenWebsiteChoices = ['Tous', 'EPS', 'E+S'];
    this.chosenWebsite = this.chosenWebsiteChoices[0];

    // do it here only not to have the error
    this.reset();

    this.discountContextMenuItems = [
      {
        label: 'Éditer',
        icon: 'pi pi-pencil',
        command: this.showDiscountOverlay.bind(this)
      }
    ];

    this.initialAdditionalInformation.popularities = ProductPopularity.toIdNameDto();
  }

  async ngOnInit()
  {
    let routedData: { selectedIds: number[] } = history.state;
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [6190];
    // routedData.selectedIds = [7909, 7910, 7911, 7912];

    await this.fetchReferences(routedData.selectedIds);
    this.initialAdditionalInformation.manufacturers = await this.commonRequest.fetchManufacturers();
    this.initialAdditionalInformation.discounts = await this.getDiscountsService.getDiscounts();

    this.reset();
    this.loading = false;
  }

  get OperationEnum(): typeof OperationEnum
  {
    return OperationEnum;
  }

  showDiscountOverlay()
  {
    this.discountOverlayVisible = true;
  }

  async fetchReferences(ids: number[])
  {
    this.allProductReferences = await this.productReferencesService.getProductReferences();

    this.otherProducts = this.allProductReferences
      .filter((e: IdNameDto) => ids.includes(e.id));
  }

  // Look in additionalInformation
  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = Operation.completeMethod(event.query, // @ts-ignore
      this.initialAdditionalInformation[fieldName]);
  }

  reset()
  {
    this.additionalInformation = Operation.deepCopy(this.initialAdditionalInformation);
    this.dS = {
      manufacturer: {value: undefined, active: false},
      popularity: {value: undefined, active: false},
      availability: {value: undefined, active: false},
      km: {
        value: undefined, active: false,
        other: {
          state: OperationEnum.Multiply,
          states: [OperationEnum.Multiply, OperationEnum.Equal]
        }
      },
      discount: {value: undefined, active: false},
      availableDiscounts: {
        value: [], active: false, other: {
          state: OperationEnum.Add,
          states: [OperationEnum.Add, OperationEnum.Equal, OperationEnum.Subtract]
        }
      },
      promo: {
        value: undefined, active: false,
        other: {
          state: OperationEnum.Multiply,
          states: [OperationEnum.Multiply, OperationEnum.Equal]
        }
      },
    }
  }

  buildDiff(): object | undefined
  {
    const nullFields = ['discount']

    // @ts-ignore
    const fields = {};
    let hasError = false;
    for (const key in this.dS)
    {
      // @ts-ignore
      if (!this.dS[key].active)
        continue;

      // @ts-ignore
      if (!nullFields.includes(key) && this.dS[key].value == undefined)
      {
        this.messageService.add({
          severity: 'error', summary: 'Erreur',
          detail: `Le champ ${key} ne peut pas être vide`
        });
        hasError = true;
      }

      // @ts-ignore
      fields[key] = this.dS[key];
    }

    return hasError ? undefined : fields;
  }

  private async computeChangesNumber(fields: any): Promise<ProductChangesResponseDto | void>
  {
    this.loading = true;
    const response = await this._computeChangesNumber(fields);
    this.loading = false;
    return response;
  }


  // find the number of product that will be affected
  private async _computeChangesNumber(fields: any): Promise<ProductChangesResponseDto | void>
  {
    const changeProduct: string[] = ['discount', 'availableDiscounts', 'manufacturer', 'popularity',];
    const changePropagation: string[] = ['discount'];
    const changeShopSpecific: string[] = ['km', 'discount', 'promo'];

    const changeTypes: ChangeType[] = [];
    for (const key in fields)
    {
      if (changeProduct.includes(key))
        changeTypes.push(ChangeType.Product);
      if (changePropagation.includes(key))
        changeTypes.push(ChangeType.Propagation);
      if (changeShopSpecific.includes(key))
        changeTypes.push(ChangeType.ShopSpecific);
    }

    if (changeTypes.length == 0)
      return;

    try
    {
      const data: ProductChangesRequestDto = {ids: this.otherProducts.map(e => e.id), changeTypes};
      const response = await axios.post(`${api}/product/changes`, data);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      const res: ProductChangesResponseDto = response.data;

      // if we modify the product shop specific, but not the product properties themselves
      // we should filter the shopCounts whether the shop we want
      if (changeTypes.length == 1 && changeTypes[0] == ChangeType.ShopSpecific)
      {
        const chosenWebsite = this.getChosenWebsite();
        console.log('chosenWebsite', chosenWebsite);
        res.shopCounts = res.shopCounts!.filter(e => chosenWebsite.includes(e.shop));
      }

      return res;
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.httpFail(this.messageService, e);
    }
  }

  async save()
  {
    console.log(this.dS);
    const fields = this.buildDiff();

    console.log(fields);

    if (fields == undefined)
      return;

    const changesCount = await this.computeChangesNumber(fields);
    if (changesCount == undefined
      || changesCount.directChangesCount === 0
      && (changesCount.indirectChangesCount ?? 0) === 0
      && (changesCount.shopCounts ?? 0) === 0)
    {
      this.messageService.add({
        severity: 'info', summary: 'Pas de changement',
        detail: `Avec ce que vous avez sélectionné aucun changement ne sera effectué`
      });

      return;
    }

    if (!await this.myConfirmationService.newBlocking(this.buildWarningMessage(changesCount)))
      return;

  }

  private buildWarningMessage(changesCount: ProductChangesResponseDto): string
  {
    // if we do not change an attribute that as an impact on the shop specific without being a shop specific

    let message = `Vous allez modifier ${changesCount.directChangesCount} produits directement`
      + (changesCount.indirectChangesCount ? ` et ${changesCount.indirectChangesCount} produits indirectement` : '');

    if (changesCount.shopCounts != null)
      message += ' ce qui affecteras :'
    else
      message += '.';

    for (const shopCount of changesCount.shopCounts ?? [])
      message += `<br/>&#160;&#160;- ${shopCount.count} produits sur ${Shop.toString(shopCount.shop)}`

    return message + '<br/>Êtes-vous sûr de vouloir continuer ?';
  }

  preview(index: number)
  {
    console.log(index);
  }

  getChosenWebsite(): Shop[]
  {
    console.log(this.chosenWebsite);
    const index: number = this.chosenWebsiteChoices.findIndex(s => s == this.chosenWebsite);
    if (index === 0)
      return [Shop.Eps, Shop.Es];
    if (index === 1)
      return [Shop.Eps];
    if (index === 2)
      return [Shop.Es];

    return [];
  }
}
