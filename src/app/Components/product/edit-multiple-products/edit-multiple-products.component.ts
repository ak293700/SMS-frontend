import {Component, OnInit} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ProductReferencesService} from "../../../Services/product-references.service";
import {IListItem} from "../../selectors/editable-list/editable-list.component";
import {ProductPopularity} from "../../../../Enums/ProductPopularity";
import {Operation} from "../../../../utils/Operation";

interface Field
{
  value: any;
  active: boolean;
}


@Component({
  selector: 'app-edit-multiple-products',
  templateUrl: './edit-multiple-products.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    './edit-multiple-products.component.css'
  ],
  providers: [ProductReferencesService]
})
export class EditMultipleProductsComponent implements OnInit
{
  otherProducts: IdNameDto[] = [];
  allProductReferences: IdNameDto[] = [];

  initialAdditionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
    availabilities: IdNameDto[],
    availableDiscounts: IListItem[],
  } = {
    manufacturers: [],
    popularities: [],
    availabilities: [],
    availableDiscounts: []
  };

  additionalInformation = this.initialAdditionalInformation;

  // declare 'fields' as it's attribute are of type Field
  dS: {
    manufacturer: Field, popularity: Field,
    availability: Field,
  } = {
    manufacturer: {value: undefined, active: false},
    popularity: {value: undefined, active: false},
    availability: {value: undefined, active: false},
  }

  fields: { active: boolean, value: any, label: string, types: string[], type: string }[] = [];

  constructor(private productReferencesService: ProductReferencesService)
  {
    this.initialAdditionalInformation.popularities = ProductPopularity.toIdNameDto();

    this.additionalInformation = Operation.deepCopy(this.initialAdditionalInformation);

    this.fields = [
      {active: false, value: undefined, label: 'Popularité', types: ['checkbox'], type: 'checkbox'},
      {active: false, value: undefined, label: 'Km', types: ['decimal', 'factor'], type: 'decimal'},
    ];
  }

  async ngOnInit()
  {
    let routedData: { selectedIds: number[] } = history.state;
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [7909, 7910, 7911, 7912];

    await this.fetchReferences(routedData.selectedIds);
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
    this.additionalInformation[fieldName] = this.initialAdditionalInformation[fieldName]
      .filter((obj: any) => obj.name.toLowerCase().includes(event.query.toLowerCase()));
  }
}
