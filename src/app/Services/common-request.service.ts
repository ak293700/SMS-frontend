import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";
import {IdNameDto} from "../../Dtos/IdNameDto";
import {CommonRequest} from "../../utils/CommonRequest";
import {DiscountType} from "../../Enums/DiscountType";

@Injectable({
  providedIn: 'root'
})
export class CommonRequestService
{

  constructor(private messageService: MessageService) {}


  async fetchManufacturers(): Promise<IdNameDto[]>
  {
    return CommonRequest.fetchManufacturers(this.messageService);
  }

  async fetchDistributors(): Promise<IdNameDto[]>
  {
    return CommonRequest.fetchDistributors(this.messageService);
  }

  // true - success/save
  // false - fail/did not save
  async patchDiscount(diffObj: any,
                      discountType: DiscountType,): Promise<boolean>
  {
    return CommonRequest.patchDiscount(diffObj, discountType, this.messageService);
  }
}
