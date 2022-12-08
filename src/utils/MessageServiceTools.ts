import {AxiosError, AxiosResponse} from "axios";
import {MessageService} from "primeng/api";
import {HttpTools} from "./HttpTools";

export class MessageServiceTools
{
  static networkError(messageService: MessageService, message: string)
  {
    messageService.add({severity: 'error', summary: 'Network error', detail: message});
  }

  static httpFail(messageService: MessageService, response: AxiosResponse | undefined)
  {
    if (response == undefined)
      messageService.add({severity: 'warn', summary: 'Request issue', detail: 'Error during request to the server'});
    else
      messageService.add({severity: 'warn', summary: response.statusText, detail: response.data});
  }

  static axiosFail(messageService: MessageService, axiosError: AxiosError)
  {
    if (axiosError.response && HttpTools.IsCode(axiosError.response.status, 400)) // @ts-ignore
      MessageServiceTools.httpFail(messageService, axiosError.response);
    else
      MessageServiceTools.networkError(messageService, axiosError.message);
  }
}
