import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ProductReferencesService} from "../../../Services/product-references.service";
import {ProductPopularity} from "../../../../Enums/ProductPopularity";
import {Operation} from "../../../../utils/Operation";
import {Operand} from "../../../../Enums/Operand";
import {MenuItem, MessageService} from "primeng/api";
import {GetDiscountsService} from "../../../Services/get-discounts.service";
import {CommonRequestService} from "../../../Services/common-request.service";
import {ChangeType} from "../../../../Enums/ChangeType";
import {ProductChangesResponseDto} from "../../../../Dtos/ProductDtos/ChangesDtos/ProductChangesResponseDto";

import {api} from "../../../GlobalUsings";
import {ProductChangesRequestDto} from "../../../../Dtos/ProductDtos/ChangesDtos/ProductChangesRequestDto";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {MyConfirmationService} from "../../../Services/my-confirmation.service";
import {Shop} from "../../../../Enums/Shop";
import {ProductMultipleChangesDto} from "../../../../Dtos/ProductDtos/ProductMultipleChangesDto";
import {ShopSpecificMultipleChangesDto} from "../../../../Dtos/ShopSpecificDtos/ShopSpecificMultipleChangesDto";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";

interface Field
{
  value: any;
  active: boolean;
  other?: any;
}

const shopSpecificFields: string[] = ['km', 'promotion', 'active'];

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
    availableDiscounts: Field, promotion: Field, active: Field
  };

  discountContextMenuItems: MenuItem[] = [];
  discountOverlayVisible: boolean = false;

  loading: boolean = false;

  chosenWebsiteChoices: string[];
  chosenWebsiteIndex: number;

  constructor(private productReferencesService: ProductReferencesService,
              private getDiscountsService: GetDiscountsService,
              private commonRequest: CommonRequestService,
              private messageService: MessageService,
              private myConfirmationService: MyConfirmationService,
              private http: HttpClientWrapperService)
  {
    this.loading = true;
    this.chosenWebsiteChoices = ['Tous', 'EPS', 'E+S'];
    this.chosenWebsiteIndex = 0;

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
          index: 0,
          states: [Operand.Multiply, Operand.Equal]
            .map(e => Operand.toString(e))
        }
      },
      discount: {value: undefined, active: false},
      availableDiscounts: {
        value: [], active: false, other: {
          index: 0,
          states: [Operand.Add, Operand.Subtract, Operand.Equal]
            .map(e => Operand.toString(e))
        }
      },
      promotion: {
        value: undefined, active: false,
        other: {
          index: 0,
          states: [Operand.Multiply, Operand.Equal]
            .map(e => Operand.toString(e))
        }
      },
      active: {value: false, active: false}
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
    const changeShopSpecific: string[] = shopSpecificFields.concat(['discount']);

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

    const data: ProductChangesRequestDto = {ids: this.otherProducts.map(e => e.id), changeTypes};
    const response = await this.http.post(`${api}/product/changes`, data);
    if (!HttpTools.IsValid(response.status))
      return MessageServiceTools.httpFail(this.messageService, response);

    const res: ProductChangesResponseDto = response.body;

    // if we modify the product shop specific, but not the product properties themselves
    // we should filter the shopCounts whether the shop we want
    if (changeTypes.length == 1 && changeTypes[0] == ChangeType.ShopSpecific)
    {
      const chosenWebsite = this.getChosenWebsite();
      res.shopCounts = res.shopCounts!.filter(e => chosenWebsite.includes(e.shop));
    }

    return res;
  }

  async save()
  {
    const fields = this.buildDiff();

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

    this.loading = true;
    await this._save(fields);
    this.loading = false;
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

  private async _save(fields: object): Promise<void>
  {
    const request: ProductMultipleChangesDto = this.buildRequest(fields);

      const response = await this.http.patch(`${api}/product/multiple`, request);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.messageService.add({
        severity: 'success', summary: 'Sauvegarde effectuée',
        detail: "Les changements ont bien été effectués"
      });
  }

  private buildRequest(fields: object): ProductMultipleChangesDto
  {
    const request: ProductMultipleChangesDto = {
      ids: this.otherProducts.map(p => p.id)
    };

    const website = this.getChosenWebsite().length == 1 ? this.getChosenWebsite()[0] : undefined;
    const shopSpecific: ShopSpecificMultipleChangesDto = {shop: website};

    for (let field in fields)
    {
      // @ts-ignore
      let value = fields[field].value;
      if (['manufacturer', 'popularity'].includes(field))
      {
        value = value.id;
      }
      if (['manufacturer'].includes(field))
      {
        field = field + 'Id';
      }
      if (['discount'].includes(field))
      {
        field = 'selectedDiscountId';
        value = value?.id ?? null;
      }
      if (['availableDiscounts', 'km', 'promotion'].includes(field))
      { // @ts-ignore
        const operation = Operand.toEnum(fields[field].other.states[fields[field].other.index]);
        value = {data: value, operand: operation};
      }
      else if (field === 'availableDiscounts')
        value.data = value.data.map((e: IdNameDto) => e.id);

      if (shopSpecificFields.includes(field)) // @ts-ignore
        shopSpecific[field] = value;
      else // @ts-ignore
        request[field] = value;
    }

    if (Object.keys(shopSpecific).length > 1)
      request.shopSpecific = shopSpecific;

    return ProductMultipleChangesDto.build(request);
  }

  preview(index: number)
  {
    console.log(index);
  }

  getChosenWebsite(): Shop[]
  {
    if (this.chosenWebsiteIndex === 0)
      return [Shop.Eps, Shop.Es];
    if (this.chosenWebsiteIndex === 1)
      return [Shop.Eps];
    if (this.chosenWebsiteIndex === 2)
      return [Shop.Es];

    return [];
  }
}
