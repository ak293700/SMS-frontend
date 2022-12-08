import {ConfirmationService} from "primeng/api";

export class ComfirmationServiceTools
{
  // Before doing a risky operation, ask for confirmation
  static new(confirmationService: ConfirmationService, f: (p: any) => any, message: string, ...params: any[])
  {
    confirmationService.confirm({
      message: message, accept: async () =>
      {
        // if it returns a promise, wait for it to finish
        // @ts-ignore
        await this[f.name](...params);
      }
    });

  }
}
