import {Injectable} from '@angular/core';
import {IdNameDto} from "../../Dtos/IdNameDto";
import axios from "axios";
import {api} from "../GlobalUsings";
import {HttpTools} from "../../utils/HttpTools";
import {MessageServiceTools} from "../../utils/MessageServiceTools";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ProductReferencesService
{

  constructor(private messageService: MessageService) {}

  private _productReferences: IdNameDto[] | undefined = undefined;

  async fetch(): Promise<boolean>
  {
    const response = await axios.get(`${api}/product/references`);

    if (!HttpTools.IsValid(response.status))
    {
      MessageServiceTools.httpFail(this.messageService, response.data);
      return false;
    }

    this._productReferences = response.data;

    return true;
  }

  async getProductReferences(): Promise<IdNameDto[]>
  {
    if (this._productReferences === undefined)
      await this.fetch();

    // @ts-ignore
    return this._productReferences;
  }
}
