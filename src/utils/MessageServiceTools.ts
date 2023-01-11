import {MessageService} from "primeng/api";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";

export class MessageServiceTools
{
  static networkError(messageService: MessageService, message: string)
  {
    messageService.add({severity: 'error', summary: 'Network error', detail: message});
  }

  static httpFail(messageService: MessageService, response: HttpResponse<any> | undefined)
  {
    const error: HttpErrorResponse = response as unknown as HttpErrorResponse;
    if (response == undefined || error.error === undefined)
      messageService.add({severity: 'error', summary: 'Request issue', detail: 'Error during request to the server'});
    else
      messageService.add({severity: 'error', summary: response.statusText, detail: error.error});
  }
}
