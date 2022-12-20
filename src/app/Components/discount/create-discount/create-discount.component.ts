import {Component, OnInit} from '@angular/core';
import {DiscountType} from "../../../../Enums/DiscountType";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {Operation} from "../../../../utils/Operation";
import {CommonRequest} from "../../../../utils/CommonRequest";
import {ConfirmationService, MessageService} from "primeng/api";
import axios, {AxiosError} from "axios";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {CreateDerogationDto} from "../../../../Dtos/DiscountDtos/DerogationDtos/CreateDerogationDto";
import {
  CreateDistributorDiscountDto
} from "../../../../Dtos/DiscountDtos/DistributorDiscountDtos/CreateDistributorDiscountDto";

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: [
    '../../../../styles/main-color-background.css',
    '../../../../styles/button.css',
    './create-discount.component.css'
  ]
})
export class CreateDiscountComponent implements OnInit
{
  discount: any = {
    isNetPrice: false,
    discountType: {id: 0, name: ""},
    distributors: []
  };

  initialAdditionalInformation: {
    discountTypes: IdNameDto[],
    manufacturers: IdNameDto[],
    distributors: IdNameDto[],
  } = {
    discountTypes: [],
    manufacturers: [],
    distributors: [],
  };

  additionalInformation = this.initialAdditionalInformation;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {}

  async ngOnInit()
  {
    this.initialAdditionalInformation.discountTypes = DiscountType.toIdNameDto();
    this.initialAdditionalInformation.manufacturers = await CommonRequest.fetchManufacturers(this.messageService);
    this.initialAdditionalInformation.distributors = await CommonRequest.fetchDistributors(this.messageService);

    this.additionalInformation = Operation.deepCopy(this.initialAdditionalInformation);

    this.discount.discountType = Operation.first(this.additionalInformation.discountTypes);
  }

  get DiscountType()
  {
    return DiscountType;
  }

  get discountType()
  {
    return this.discount.discountType.id;
  }

  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = this.initialAdditionalInformation[fieldName]
      .filter((obj: any) => obj.name.toLowerCase().includes(event.query.toLowerCase()));
  }

  async create()
  {
    if (!this.checkValidity())
      return this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs'
      });


    await this._create(this.buildRequest())
  }

  private async _create(discount: CreateDerogationDto | CreateDistributorDiscountDto): Promise<void>
  {
    console.log(discount);

    let endpoint = "distributorDiscount";
    if (this.discountType === DiscountType.Derogation)
      endpoint = "derogation";

    try
    {
      const response = await axios.post(`${api}/${endpoint}`, discount);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Produit créé'});
      this.discount = {
        isNetPrice: false,
        discountType: {id: 0, name: ""},
        distributors: []
      }
    } catch (e: any | AxiosError)
    {
      return MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  checkValidity(): boolean
  {
    const fields = [this.discount.value, this.discount.discountType, this.discount.isNetPrice];
    if (this.discountType == DiscountType.Distributor)
      fields.push(this.discount.distributor);
    else if (this.discountType == DiscountType.Derogation)
    {
      fields.push(this.discount.manufacturer);
      fields.push(this.discount.distributors);
    }

    return fields.every(field => field !== undefined && field !== null && field !== '');
  }

  buildRequest(): CreateDerogationDto | CreateDistributorDiscountDto
  {
    // @ts-ignore
    let res: CreateDerogationDto | CreateDistributorDiscountDto = {
      value: this.discount.value,
      isNetPrice: this.discount.isNetPrice,
      quantity: this.discount.quantity,
    }

    if (this.discountType == DiscountType.Distributor)
      res = {
        ...res,
        distributorId: this.discount.distributor.id,
      } as CreateDistributorDiscountDto;
    else if (this.discountType == DiscountType.Derogation)
      res = {
        ...res,
        manufacturerId: this.discount.manufacturer.id,
        distributorIds: this.discount.distributors.map((distributor: IdNameDto) => distributor.id),
      } as CreateDerogationDto;

    return res;
  }
}
