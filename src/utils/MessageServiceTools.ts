import {AxiosError} from "axios";
import {MessageService} from "primeng/api";
import {HttpTools} from "./HttpTools";
import {HttpResponse} from "@angular/common/http";

export class MessageServiceTools
{
  static networkError(messageService: MessageService, message: string)
  {
    messageService.add({severity: 'error', summary: 'Network error', detail: message});
  }

  static httpFail(messageService: MessageService, response: HttpResponse<any> | undefined)
  {
    if (response == undefined)
      messageService.add({severity: 'warn', summary: 'Request issue', detail: 'Error during request to the server'});
    else
      messageService.add({severity: 'warn', summary: response.statusText, detail: response.body});
  }

  static axiosFail(messageService: MessageService, axiosError: AxiosError)
  {
    console.log(axiosError)
    if (axiosError.response && HttpTools.IsCode(axiosError.response.status, 400)) // @ts-ignore
      MessageServiceTools.httpFail(messageService, axiosError.response);
    else
    {
      // @ts-ignore
      MessageServiceTools.networkError(messageService, axiosError?.response?.data.toString() ?? axiosError.message);
    }
  }
}
