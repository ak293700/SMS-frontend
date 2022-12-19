import {Component, OnInit} from '@angular/core';
import {ProductReferencesService} from "../../../../../Services/product-references.service";
import {IdNameDto} from "../../../../../../Dtos/IdNameDto";
import {IListItem} from "../../../../editable-list/editable-list.component";

@Component({
  selector: 'app-choose-bundle-composant',
  templateUrl: './choose-bundle-composant.component.html',
  styleUrls: [
    '../../../../../../styles/main-color-background.css',
    '../../../../../../styles/button.css',
    './choose-bundle-composant.component.css'
  ],
  providers: [ProductReferencesService]
})
export class ChooseBundleComposantComponent implements OnInit
{

  productReferences: IdNameDto[] = [];
  components: IListItem[] = [];

  additionalFields: { fieldName: string, label: string, type: string, default?: any }[] = [];

  constructor(private productReferencesService: ProductReferencesService)
  {
    this.additionalFields = [
      {
        fieldName: "quantity",
        label: "Quantité",
        type: "number",
        default: 1
      }
    ];
  }

  async ngOnInit()
  {
    this.productReferences = await this.productReferencesService.getProductReferences();
  }
}
