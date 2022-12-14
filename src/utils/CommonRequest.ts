import axios from "axios";
import {api} from "../app/GlobalUsings";
import {HttpTools} from "./HttpTools";
import {MessageServiceTools} from "./MessageServiceTools";
import {IdNameDto} from "../Dtos/IdNameDto";
import {MessageService} from "primeng/api";

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
}
