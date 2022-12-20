import {Component} from '@angular/core';
import {DiscountType} from "../../../../Enums/DiscountType";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {Operation} from "../../../../utils/Operation";

@Component({
  selector: 'app-create-discount',
  templateUrl: './create-discount.component.html',
  styleUrls: [
    '../../../../styles/main-color-background.css',
    '../../../../styles/button.css',
    './create-discount.component.css'
  ]
})
export class CreateDiscountComponent
{
  discount: any = {isNetPrice: false};

  initialAdditionalInformation: {
    discountTypes: IdNameDto[],
  } = {
    discountTypes: [],
  };

  additionalInformation = this.initialAdditionalInformation;

  constructor()
  {
    this.initialAdditionalInformation.discountTypes = DiscountType.toIdNameDto();
    this.additionalInformation = Operation.deepCopy(this.initialAdditionalInformation);

    console.log(this.additionalInformation.discountTypes);
    this.discount.discountType = this.additionalInformation.discountTypes[0];
  }

  get DiscountType()
  {
    return DiscountType;
  }

  create()
  {
    console.log("Create");
  }

  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = this.initialAdditionalInformation[fieldName]
      .filter((obj: any) => obj.name.toLowerCase().includes(event.query.toLowerCase()));
  }

}
