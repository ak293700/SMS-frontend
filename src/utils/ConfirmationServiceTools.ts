import {ConfirmationService} from "primeng/api";

export class ConfirmationServiceTools
{
  // Before doing a risky operation, ask for confirmation
  static new(confirmationService: ConfirmationService, instance: any, f: (p: any) => any, message: string, ...params: any[])
  {
    confirmationService.confirm({
      message: message, accept: async () =>
      {
        // if it returns a promise, wait for it to finish
        // @ts-ignore
        await instance[f.name](...params);
      }
    });

  }

  // Before doing a risky operation, ask for confirmation
  // f: the function to execute when success
  // message: the message to display
  // params: the parameters to pass to f
  static newComplexFunction(confirmationService: ConfirmationService, f: (...params: any[]) => any, message: string, ...params: any[])
  {
    confirmationService.confirm({
      message: message, accept: async () =>
      {
        // if it returns a promise, wait for it to finish
        // @ts-ignore
        await f(...params);
      }
    });

  }
}
