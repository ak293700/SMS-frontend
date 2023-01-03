import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {IdNameDto} from "../../Dtos/IdNameDto";
import {api} from "../GlobalUsings";
import {HttpTools} from "../../utils/HttpTools";
import {MessageServiceTools} from "../../utils/MessageServiceTools";
import {HttpClientWrapperService} from "./http-client-wrapper.service";

@Injectable({
  providedIn: 'root'
})
export class GetDiscountsService
{

  constructor(private messageService: MessageService,
              private http: HttpClientWrapperService)
  {}

  private _discounts: IdNameDto[] | undefined = undefined;

  // if set to true it means that the product references are being loaded
  private _isLoaded: boolean = true;

  refresh(): void
  {
    this._isLoaded = true;

    this.http.get(`${api}/discount`)
      .then(response => {

        if (!HttpTools.IsValid(response.status))
          MessageServiceTools.httpFail(this.messageService, response.body);
        else
          this._discounts = response.body;

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

  async getDiscounts(): Promise<IdNameDto[]>
  {
    if (this._discounts === undefined)
      await this.fetch();

    // @ts-ignore
    return this._discounts;
  }

  push(id: number, name: string): void
  {
    if (this._discounts === undefined)
      return;

    this._discounts.push({id, name});
  }
}
