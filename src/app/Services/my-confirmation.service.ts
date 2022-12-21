import {Injectable} from '@angular/core';
import {ConfirmationService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class MyConfirmationService
{

  constructor(private confirmationService: ConfirmationService) { }

  newBlocking(message: string): Promise<boolean>
  {
    return new Promise<boolean>(resolve => {
      this.confirmationService.confirm({
        message: message, accept: () =>
        {
          resolve(true);
        }, reject: () =>
        {
          resolve(false);
        }
      });
    });
  }
}
