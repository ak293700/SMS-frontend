import {Component} from '@angular/core';
import {MessageService} from "primeng/api";
import axios, {AxiosError} from "axios";
import {api} from "../../../GlobalUsings";
import {HttpTools} from "../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";

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

  constructor(private messageService: MessageService)
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
    try
    {
      const response = await axios.post(`${api}/Distributor`, request,
        {headers: {'Content-Type': 'application/json'}});
      console.log(response);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Distributeur créé'});
      this.distributor = {
        name: ""
      }
    } catch (e: any | AxiosError)
    {
      console.log(e);
      return MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

}
