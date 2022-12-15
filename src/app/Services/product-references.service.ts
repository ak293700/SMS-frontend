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

  // if set to true it means that the product references are being loaded
  private _isLoaded: boolean = true;

  reload(): void
  {
    this._isLoaded = true;
    // const response =;
    axios.get(`${api}/product/references`)
      .then(response => {
        if (!HttpTools.IsValid(response.status))
          MessageServiceTools.httpFail(this.messageService, response.data);
        else
          this._productReferences = response.data;

        this._isLoaded = false;
      })
      .catch(error => {
        MessageServiceTools.axiosFail(this.messageService, error);
      });
  }

  // the async of reload
  private async fetch()
  {
    this.reload();

    // wait for this._isLoaded to be false
    while (this._isLoaded)
      await new Promise(resolve => setTimeout(resolve, 100));
  }

  async getProductReferences(): Promise<IdNameDto[]>
  {
    if (this._productReferences === undefined)
      await this.fetch();

    // @ts-ignore
    return this._productReferences;
  }
}
