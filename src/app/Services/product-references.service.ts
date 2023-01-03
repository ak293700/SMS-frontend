import {Injectable} from '@angular/core';
import {IdNameDto} from "../../Dtos/IdNameDto";

import {api} from "../GlobalUsings";
import {HttpTools} from "../../utils/HttpTools";
import {MessageServiceTools} from "../../utils/MessageServiceTools";
import {MessageService} from "primeng/api";
import {ProductType} from "../../Enums/ProductType";
import {HttpClientWrapperService} from "./http-client-wrapper.service";

@Injectable({
  providedIn: 'root'
})
export class ProductReferencesService
{

  constructor(private messageService: MessageService,
              private http: HttpClientWrapperService)
  {}

  private _productReferences: IdNameDto[] | undefined = undefined;
  private _productTypes: { [prop: number]: ProductType; } = {};
  private _shopSpecificPerProduct: { [prop: number]: number; } = {};

  // if set to true it means that the product references are being loaded
  private _isLoaded: boolean = true;

  refresh(): void
  {
    this._isLoaded = true;
    this._productTypes = {};
    this._shopSpecificPerProduct = {};

    this.http.get(`${api}/product/references`)
      .then(response => {
        if (!HttpTools.IsValid(response.status))
          MessageServiceTools.httpFail(this.messageService, response.body);
        else
          this._productReferences = response.body;

        this._isLoaded = false;
      });
  }

  // the async of reload
  private async fetch()
  {
    this.refresh();

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

  push(id: number, name: string): void
  {
    if (this._productReferences === undefined)
      return;

    this._productReferences.push({id, name});
  }

  // return the productType of a product
  async getProductTypes(id: number): Promise<ProductType>
  {
    if (this._productTypes[id] !== undefined)
      return this._productTypes[id];

      const response = await this.http.get(`${api}/product/type/${id}`);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response.body);
      else
        this._productTypes[id] = response.body;

    return this._productTypes[id];
  }
}
