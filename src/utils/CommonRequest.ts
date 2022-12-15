import axios, {AxiosError, AxiosResponse} from "axios";
import {api} from "../app/GlobalUsings";
import {HttpTools} from "./HttpTools";
import {MessageServiceTools} from "./MessageServiceTools";
import {IdNameDto} from "../Dtos/IdNameDto";
import {MessageService} from "primeng/api";
import {PatchDistributorDiscountDto} from "../Dtos/DiscountDtos/DistributorDiscountDtos/PatchDistributorDiscountDto";
import {PatchDerogationDto} from "../Dtos/DiscountDtos/DerogationDtos/PatchDerogationDto";
import {PatchDiscountDto} from "../Dtos/DiscountDtos/PatchDiscountDto";
import {DiscountType} from "../Enums/DiscountType";
import {Operation} from "./Operation";

export class CommonRequest
{
  static async fetchManufacturers(messageService: MessageService): Promise<IdNameDto[]>
  {
    try
    {
      // Get the products itself
      const response = await axios.get(`${api}/Manufacturer/`);
      if (HttpTools.IsValid(response.status))
        return response.data;

      MessageServiceTools.httpFail(messageService, response);
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(messageService, e);
    }

    return [];
  }

  static async fetchDistributors(messageService: MessageService): Promise<IdNameDto[]>
  {
    try
    {
      // Get the products itself
      const response = await axios.get(`${api}/Distributor/`);
      if (HttpTools.IsValid(response.status))
        return response.data;

      MessageServiceTools.httpFail(messageService, response);
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(messageService, e);
    }

    return [];
  }

  // true - success/save
  // false - fail/did not save
  static async patchDiscount(diffObj: any,
                             discountType: DiscountType,
                             messageService: MessageService): Promise<boolean>
  {
    if (diffObj == undefined)
      return false;

    let namespace: any = PatchDistributorDiscountDto;
    let endpoint = 'distributorDiscount';
    if (discountType === DiscountType.Derogation)
    {
      namespace = PatchDerogationDto;
      endpoint = 'derogation';
    }

    const patchProduct: PatchDiscountDto = namespace.build(diffObj);
    try
    {
      // Detect if patch is empty - more than 1 because of the id
      if (Operation.countProperties(patchProduct) > 1)
      {
        const response: AxiosResponse = await axios.patch(`${api}/${endpoint}/`, patchProduct);
        if (!HttpTools.IsValid(response.status))
        {
          MessageServiceTools.httpFail(messageService, response);
          return false;
        }
      }
      else
        return false;

    } catch (e: any | AxiosError)
    {
      MessageServiceTools.axiosFail(messageService, e);
      return false;
    }

    return true;
  }
}
