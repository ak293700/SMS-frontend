import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {IdNameDto} from "../../Dtos/IdNameDto";
import {DiscountType} from "../../Enums/DiscountType";
import {api} from "../GlobalUsings";
import {HttpTools} from "../../utils/HttpTools";
import {MessageServiceTools} from "../../utils/MessageServiceTools";
import {HttpClientWrapperService} from "./http-client-wrapper.service";
import {PatchDistributorDiscountDto} from "../../Dtos/DiscountDtos/DistributorDiscountDtos/PatchDistributorDiscountDto";
import {PatchDerogationDto} from "../../Dtos/DiscountDtos/DerogationDtos/PatchDerogationDto";
import {PatchDiscountDto} from "../../Dtos/DiscountDtos/PatchDiscountDto";
import {Operation} from "../../utils/Operation";


@Injectable({
  providedIn: 'root'
})
export class CommonRequestService
{

  constructor(private messageService: MessageService,
              private httpClient: HttpClientWrapperService)
  {}


  async fetchManufacturers(): Promise<IdNameDto[]>
  {
    // Get the products itself
    const response = await this.httpClient.get(`${api}/Manufacturer/`);
    if (!HttpTools.IsValid(response.status))
    {
      MessageServiceTools.httpFail(this.messageService, response);
      return [];
    }

    return response.body;
  }

  async fetchDistributors(): Promise<IdNameDto[]>
  {
    // Get the products itself
    const response = await this.httpClient.get(`${api}/Distributor/`);
    if (!HttpTools.IsValid(response.status))
    {
      MessageServiceTools.httpFail(this.messageService, response);
      return [];
    }

      return response.body;
  }

  // true - success/save
  // false - fail/did not save
  async patchDiscount(diffObj: any,
                      discountType: DiscountType,): Promise<boolean>
  {
    // return CommonRequest.patchDiscount(diffObj, discountType, this.messageService);

    if (diffObj == undefined)
      return false;

    let namespace: any = PatchDistributorDiscountDto;
    let endpoint = 'distributorDiscount';
    if (discountType === DiscountType.Derogation)
    {
      namespace = PatchDerogationDto;
      endpoint = 'derogation';
    }

    const patchDiscount: PatchDiscountDto = namespace.build(diffObj);

    // remove distributorIds because it s done in a different way
    const derogation = patchDiscount as PatchDerogationDto;
    const distributorIds = derogation.distributorIds;
    delete derogation.distributorIds;

      // Detect if patch is empty - more than 1 because of the id
      if (Operation.countProperties(patchDiscount) > 1)
      {
        const response = await this.httpClient.patch(`${api}/${endpoint}/`, patchDiscount);
        if (!HttpTools.IsValid(response.status))
        {
          MessageServiceTools.httpFail(this.messageService, response);
          return false;
        }
      }

      if (discountType === DiscountType.Derogation && distributorIds != undefined)
      { // if the discount is a derogation and change the distributors linked to it, then we update them
        const response = await this.httpClient.post(`${api}/derogation/distributors/${derogation.id}`,
          distributorIds);
        if (!HttpTools.IsValid(response.status))
        {
          MessageServiceTools.httpFail(this.messageService, response);
          return false;
        }
      }

    return true;
  }
}
