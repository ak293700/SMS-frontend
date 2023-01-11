import {Component} from '@angular/core';
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {CreateFeatureModelDto} from "../../../../Dtos/FeatureDtos/FeatureModelDtos/CreateFeatureModelDto";
import {MessageService} from "primeng/api";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";

@Component({
  selector: 'app-create-feature-model',
  templateUrl: './create-feature-model.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    '../../../../styles/main-color-background.css',
    './create-feature-model.component.css'
  ]
})
export class CreateFeatureModelComponent
{
  // @ts-ignore
  featureModel: CreateFeatureModelDto;

  constructor(private http: HttpClientWrapperService,
              private messageService: MessageService)
  {
    this.initFeatureModel();
  }

  initFeatureModel()
  {
    this.featureModel = {
      name: "",
      prefix: "",
      suffix: "",
    }
  }

  checkValidity(): boolean
  {
    // if is null or empty
    return !(this.featureModel.name == null || this.featureModel.name.trim() === "");
  }

  async create(): Promise<void>
  {
    if (!this.checkValidity())
      return this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs'
      });

    await this._create(this.featureModel)
  }

  private async _create(request: CreateFeatureModelDto): Promise<void>
  {
    const response = await this.http.post(`${api}/FeatureModel`, request);
    console.log(response);
    console.log(response.body);
    if (!HttpTools.IsValid(response.status))
      return MessageServiceTools.httpFail(this.messageService, response);

    this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Caractéristique créé'});
    this.initFeatureModel();
  }
}
