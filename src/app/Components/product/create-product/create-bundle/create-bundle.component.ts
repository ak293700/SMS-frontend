import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {IdNameDto} from "../../../../../Dtos/IdNameDto";
import {ProductPopularity} from "../../../../../Enums/ProductPopularity";
import {IListItem} from "../../../selectors/editable-list/editable-list.component";
import {ProductReferencesService} from "../../../../Services/product-references.service";
import {CreateBundleItemDto} from "../../../../../Dtos/ProductDtos/BundleDto/BundleItemDto/CreateBundleItemDto";
import {CreateBundleDto} from "../../../../../Dtos/ProductDtos/BundleDto/CreateBundleDto";
import {AxiosError} from "axios";
import {api} from "../../../../GlobalUsings";
import {HttpTools} from "../../../../../utils/HttpTools";
import {MessageServiceTools} from "../../../../../utils/MessageServiceTools";
import {Operation} from "../../../../../utils/Operation";
import {HttpClientWrapperService} from "../../../../Services/http-client-wrapper.service";
import {CommonRequestService} from "../../../../Services/common-request.service";

@Component({
  selector: 'app-create-bundle',
  templateUrl: './create-bundle.component.html',
  styleUrls: [
    '../../../../../styles/main-color-background.css',
    '../../../../../styles/button.css',
    './create-bundle.component.css'
  ],
  providers: [ProductReferencesService]
})
export class CreateBundleComponent implements OnInit
{
  product: any = {items: []};

  initialAdditionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
  } = {
    manufacturers: [],
    popularities: [],
  };

  additionalInformation = this.initialAdditionalInformation;

  productReferences: IdNameDto[] = [];

  additionalFields: { fieldName: string, label: string, type: string, default?: any }[] = [];

  constructor(private messageService: MessageService,
              private productReferencesService: ProductReferencesService,
              private http: HttpClientWrapperService,
              private commonRequest: CommonRequestService)
  {
    this.additionalFields = [
      {fieldName: 'quantity', label: 'Quantité', type: 'number', default: 1},
    ];
  }

  async ngOnInit()
  {
    this.productReferences = await this.productReferencesService.getProductReferences();
    this.additionalInformation.popularities = ProductPopularity.toIdNameDto();
    this.additionalInformation.manufacturers = await this.commonRequest.fetchManufacturers();
  }

  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = Operation.completeMethod(event.query, // @ts-ignore
      this.initialAdditionalInformation[fieldName]);
  }

  async create()
  {
    if (!this.checkValidity())
      return this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez remplir tous les champs'
      });

    await this._create(this.buildRequest());
  }

  private async _create(bundle: CreateBundleDto): Promise<void>
  {
    try
    {
      const response = await this.http.post(`${api}/bundle`, bundle);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Produit créé'});
      this.product = {items: []};

      this.productReferencesService.push(response.body.id, response.body.name);
    } catch (e: any | AxiosError)
    {
      return MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  checkValidity(): boolean
  {
    const fields = [this.product.productReference, this.product.manufacturer, this.product.popularity, this.product.items];

    return fields.every(field => field !== undefined && field !== null && field !== '');
  }

  buildRequest(): CreateBundleDto
  {
    const bundleItems: CreateBundleItemDto[] = this.product.items
      .map((item: IListItem) => {
        return {
          productId: item.id,
          quantity: item.additionalFields.quantity,
        };
      });

    return {
      productReference: this.product.productReference,
      ean13: this.product.ean13,
      popularity: this.product.popularity.id,
      manufacturerId: this.product.manufacturer.id,
      shopSpecifics: [],
      bundleItems: bundleItems,
    };
  }
}
