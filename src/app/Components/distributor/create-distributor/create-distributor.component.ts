import {Component} from '@angular/core';
import {MessageService} from "primeng/api";

import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";

@Component({
  selector: 'app-create-distributor',
  templateUrl: './create-distributor.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    '../../../../styles/main-color-background.css',
    './create-distributor.component.css'
  ]
})
export class CreateDistributorComponent
{
  distributor: { name: string } = {name: ""};

  constructor(private messageService: MessageService,
              private http: HttpClientWrapperService)
  {}

  checkValidity(): boolean
  {
    // if is null or empty
    if (this.distributor.name == null || this.distributor.name.trim() === "")
      return false;

    return true;
  }

  async create()
  {
    if (!this.checkValidity())
      return this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs'
      });

    await this._create(this.distributor.name)
  }

  private async _create(request: string): Promise<void>
  {
      // TODO: try without {headers: {'Content-Type': 'application/json'}}
      const response = await this.http.post(`${api}/Distributor`, request);
      console.log(response);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Distributeur créé'});
      this.distributor = {
        name: ""
      }
  }

}
