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
    availableDiscounts: Field
  };

  discountContextMenuItems: MenuItem[] = [];
  discountOverlayVisible: boolean = false;

  constructor(private productReferencesService: ProductReferencesService,
              private getDiscountsService: GetDiscountsService,
              private commonRequest: CommonRequestService,
              private messageService: MessageService,
              private myConfirmationService: MyConfirmationService)
  {
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
      routedData.selectedIds = [7909, 7910, 7911, 7912];

    await this.fetchReferences(routedData.selectedIds);
    this.initialAdditionalInformation.manufacturers = await this.commonRequest.fetchManufacturers();
    this.initialAdditionalInformation.discounts = await this.getDiscountsService.getDiscounts();

    this.reset();
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
      .filter((e: IdNameDto) => ids.includes(e.id))
      .sort((a: IdNameDto, b: IdNameDto) => ids.indexOf(a.id) - ids.indexOf(b.id));
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

  // find the number of product that will be affected
  async computeChangesNumber(fields: any): Promise<ProductChangesResponseDto | void>
  {
    const productWithoutPropagationFields: string[] = ['manufacturer', 'popularity', 'availability',
      'availableDiscounts', 'discount'];
    const productWithPropagationFields: string[] = ['discount'];
    const shopSpecificFields: string[] = ['km'];

    const changeTypes: ChangeType[] = [];
    for (const key in fields)
    {
      if (productWithoutPropagationFields.includes(key))
        changeTypes.push(ChangeType.ProductWithoutPropagation);
      if (productWithPropagationFields.includes(key))
        changeTypes.push(ChangeType.ProductWithPropagation);
      if (shopSpecificFields.includes(key))
        changeTypes.push(ChangeType.ShopSpecific);
    }

    // changeTypes should only have unique values
    changeTypes.filter((e, i) => changeTypes.indexOf(e) === i);

    console.log(changeTypes);
    if (changeTypes.length == 0)
      return;

    try
    {
      const data: ProductChangesRequestDto = {ids: this.otherProducts.map(e => e.id), changeTypes};
      const response = await axios.post(`${api}/product/changes`, data);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      return response.data;
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
      && (changesCount.shopSpecificChangesCount ?? 0) === 0)
    {
      this.messageService.add({
        severity: 'info', summary: 'Pas de changement',
        detail: `Avec ce que vous avez sélectionné aucun changement ne sera effectué`
      });

      return;
    }

    const message = `Vous allez modifier ${changesCount.directChangesCount} produits directement`
      + (changesCount.indirectChangesCount ? ` et ${changesCount.indirectChangesCount} produits indirectement` : '')
      + (changesCount.shopSpecificChangesCount
        ? ` ce qui affecteras ${changesCount.shopSpecificChangesCount} modifications sur les sites` : '')
      + '.<br/>Êtes-vous sûr de vouloir continuer ?';

    if (!await this.myConfirmationService.newBlocking(message))
      return;


    console.log(changesCount);

    // const patch: PatchSimpleProductDto | PatchBundleDto = {
    //
    // };

  }

  preview(index: number)
  {
    console.log(index);
  }
}
