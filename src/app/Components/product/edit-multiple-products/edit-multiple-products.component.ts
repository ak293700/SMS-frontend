import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ProductReferencesService} from "../../../Services/product-references.service";
import {ProductPopularity} from "../../../../Enums/ProductPopularity";
import {Operation} from "../../../../utils/Operation";
import {OperationEnum} from "../../../../Enums/OperationEnum";
import {MenuItem} from "primeng/api";
import {GetDiscountsService} from "../../../Services/get-discounts.service";
import {CommonRequestService} from "../../../Services/common-request.service";

interface Field
{
  value: any;
  active: boolean;
  other?: any;
}


@Component({
  selector: 'app-edit-multiple-products',
  templateUrl: './edit-multiple-products.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    './edit-multiple-products.component.css'
  ],
  providers: [ProductReferencesService, GetDiscountsService, CommonRequestService]
})
export class EditMultipleProductsComponent implements OnInit
{
  otherProducts: IdNameDto[] = [];
  allProductReferences: IdNameDto[] = [];

  initialAdditionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
    availabilities: IdNameDto[],
    discounts: IdNameDto[]
  } = {
    manufacturers: [],
    popularities: [],
    availabilities: [],
    discounts: []
  };

  additionalInformation = this.initialAdditionalInformation;

  dS: {
    manufacturer: Field, popularity: Field,
    availability: Field, km: Field, discount: Field,
    availableDiscounts: Field
  } = {
    manufacturer: {value: undefined, active: false},
    popularity: {value: undefined, active: false},
    availability: {value: undefined, active: false},
    km: {value: undefined, active: false},
    discount: {value: undefined, active: false},
    availableDiscounts: {
      value: [], active: false, other: {
        state: OperationEnum.Add,
        states: [OperationEnum.Add, OperationEnum.Equal, OperationEnum.Subtract]
      }
    },
  }

  discountContextMenuItems: MenuItem[] = [];
  discountOverlayVisible: boolean = false;

  constructor(private productReferencesService: ProductReferencesService,
              private getDiscountsService: GetDiscountsService,
              private commonRequest: CommonRequestService)
  {
    this.discountContextMenuItems = [
      {
        label: 'Éditer',
        icon: 'pi pi-pencil',
        command: this.showDiscountOverlay.bind(this)
      }
    ];

    this.initialAdditionalInformation.popularities = ProductPopularity.toIdNameDto();
  }

  async ngOnInit()
  {
    let routedData: { selectedIds: number[] } = history.state;
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [7909, 7910, 7911, 7912];

    await this.fetchReferences(routedData.selectedIds);
    this.initialAdditionalInformation.manufacturers = await this.commonRequest.fetchManufacturers();
    this.initialAdditionalInformation.discounts = await this.getDiscountsService.getDiscounts();

    this.additionalInformation = Operation.deepCopy(this.initialAdditionalInformation);
  }

  get OperationEnum(): typeof OperationEnum
  {
    return OperationEnum;
  }

  showDiscountOverlay()
  {
    this.discountOverlayVisible = true;
  }

  async fetchReferences(ids: number[])
  {
    this.allProductReferences = await this.productReferencesService.getProductReferences();

    this.otherProducts = this.allProductReferences
      .filter((e: IdNameDto) => ids.includes(e.id))
      .sort((a: IdNameDto, b: IdNameDto) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }

  // Look in additionalInformation
  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    console.log(this.initialAdditionalInformation[fieldName])

    // @ts-ignore
    this.additionalInformation[fieldName] = Operation.completeMethod(event.query, // @ts-ignore
      this.initialAdditionalInformation[fieldName]);
  }
}
