import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {HttpClientWrapperService} from "./http-client-wrapper.service";
import {IdNameDto} from "../../Dtos/IdNameDto";
import {api} from "../GlobalUsings";
import {HttpTools} from "../../utils/HttpTools";
import {MessageServiceTools} from "../../utils/MessageServiceTools";

@Injectable({
  providedIn: 'root'
})
export class FeatureModelsService
{

  constructor(private messageService: MessageService,
              private http: HttpClientWrapperService)
  {}

  private _featureModels: IdNameDto[] | undefined = undefined;

  // if set to true it means that the product references are being loaded
  private _isLoaded: boolean = true;

  refresh(): void
  {
    this._isLoaded = true;

    this.http.get(`${api}/featureModel/`)
        .then(response => {
          if (!HttpTools.IsValid(response.status))
            MessageServiceTools.httpFail(this.messageService, response.body);
          else
            this._featureModels = response.body;

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

  async getFeatureModels(): Promise<IdNameDto[]>
  {
    if (this._featureModels === undefined)
      await this.fetch();

    // @ts-ignore
    return this._featureModels;
  }

  push(id: number, name: string): void
  {
    if (this._featureModels === undefined)
      return;

    this._featureModels.push({id, name});
  }
}
