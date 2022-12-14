import {Component, OnInit} from '@angular/core';
import {api} from "../../../GlobalUsings";
import axios, {AxiosResponse} from "axios";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpTools} from "../../../../utils/HttpTools";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ProductType} from "../../../../Enums/ProductType";
import {BundleDto} from "../../../../Dtos/ProductDtos/BundleDto/BundleDto";
import {SimpleProductDto} from "../../../../Dtos/ProductDtos/SimpleProductDtos/SimpleProductDto";
import {Operation} from "../../../../utils/Operation";
import {Shop} from "../../../../Enums/Shop";
import {ProductPopularity} from "../../../../Enums/ProductPopularity";
import {Availability} from "../../../../Enums/Availability";
import {PatchSimpleProductDto} from "../../../../Dtos/ProductDtos/SimpleProductDtos/PatchSimpleProductDto";
import {PatchBundleDto} from "../../../../Dtos/ProductDtos/BundleDto/PatchBundleDto";
import {PatchProductDto} from "../../../../Dtos/ProductDtos/PatchProductDto";
import {PatchShopSpecificDto} from "../../../../Dtos/ShopSpecificDtos/PatchShopSpecificDto";
import {ConfirmationServiceTools} from "../../../../utils/ConfirmationServiceTools";
import {DiscountType} from "../../../../Enums/DiscountType";
import {DialogService} from "primeng/dynamicdialog";
import {DiscountFilterComponent} from "../../discount/discount-filter/discount-filter.component";

@Component({
  selector: 'app-edit-one-product',
  templateUrl: './edit-one-product.component.html',
  styleUrls: ['./edit-one-product.component.css', '../../../../styles/button.css'],
  providers: [DialogService]
})
export class EditOneProductComponent implements OnInit
{
  discountContextMenuItems: MenuItem[];

  otherProducts: IdNameDto[] = [];

  // @ts-ignore
  product: SimpleProductDto | BundleDto;
  // Describe the product as it is at the moment in the db
  // @ts-ignore
  initialProduct: SimpleProductDto | BundleDto;

  initialAdditionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
    availabilities: IdNameDto[],
  } = {
    manufacturers: [],
    popularities: [],
    availabilities: [],
  };

  additionalInformation = this.initialAdditionalInformation;

  // Use to ngModel some product fields
  dummyStruct: { manufacturer: IdNameDto, popularity: IdNameDto, availability: IdNameDto } = {
    manufacturer: {id: 0, name: ""},
    popularity: {id: 0, name: ""},
    availability: {id: 0, name: ""}
  }

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService)
  {
    this.discountContextMenuItems = [
      {
        label: 'Éditer',
        icon: 'pi pi-pencil',
        command: () => {
          const ref = this.dialogService.open(DiscountFilterComponent, {
            header: 'Remise',
            width: '90%',
          });
        }
      }
    ];

    this.additionalInformation.popularities = ProductPopularity.toIdNameDto();
    this.additionalInformation.availabilities = Availability.toIdNameDto();
    this.initialAdditionalInformation = Operation.deepCopy(this.additionalInformation);
  }

  async ngOnInit()
  {
    let routedData: { selectedIds: number[], selectedId: number } = history.state;
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [6190, 6233, 6237, 7257, 2863];

    if (routedData.selectedId == undefined)
      routedData.selectedId = Operation.firstOrDefault(routedData.selectedIds) ?? 0;

    // push at the beginning of the array
    if (!routedData.selectedIds.includes(routedData.selectedId))
      routedData.selectedIds.unshift(routedData.selectedId);

    await this.fetchManufacturers(); // Do it first so the dummy struct is well initialized
    await this.fetchReferences(routedData.selectedIds);
    await this.fetchProduct(routedData.selectedId);
  }

  async fetchProduct(id: number)
  {
    console.log("fetchProduct", id);
    try
    {
      // Get the products itself
      const response = await axios.get(`${api}/product/${id}`);
      if (!HttpTools.IsCode(response.status, 200))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.initialProduct = response.data;
      this.product = Operation.deepCopy(this.initialProduct);
      this.initDummyStruct();
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // Initialize dummy struct with the product data
  initDummyStruct()
  {
    this.dummyStruct.manufacturer = this.additionalInformation.manufacturers
      .find(x => x.id == this.product.manufacturerId)!;

    this.dummyStruct.popularity = this.additionalInformation.popularities
      .find(x => x.id == this.product.popularity)!;

    if (this.product.productType == ProductType.Simple)
    {
      this.dummyStruct.availability = this.additionalInformation.availabilities
        .find(x => x.id == this.simpleProduct.availability)!;
    }
  }

  async fetchManufacturers()
  {
    try
    {
      // Get the products itself
      const response = await axios.get(`${api}/Manufacturer/`);
      if (!HttpTools.IsCode(response.status, 200))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.additionalInformation.manufacturers = response.data;
      // deep copy this.additionalInformation.manufacturers
      this.initialAdditionalInformation.manufacturers = [...response.data];
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // Look in additionalInformation
  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = this.initialAdditionalInformation[fieldName]
      .filter((obj: any) => obj.name.toLowerCase().includes(event.query.toLowerCase()));
  }

  get ProductType(): typeof ProductType
  {
    return ProductType;
  }

  get DiscountType(): typeof DiscountType
  {
    return DiscountType;
  }

  Transform<T>(obj: any): T
  {
    return obj as T;
  }

  get simpleProduct()
  {
    return this.Transform<SimpleProductDto>(this.product);
  }

  get bundle()
  {
    return this.Transform<BundleDto>(this.product);
  }

  get initialSimpleProduct()
  {
    return this.Transform<SimpleProductDto>(this.initialProduct);
  }

  get initialBundle()
  {
    return this.Transform<BundleDto>(this.initialProduct);
  }

  async fetchReferences(ids: number[])
  {
    try
    {
      const response = await axios.post(`${api}/product/references`, ids);
      if (response.status !== 200)
        return MessageServiceTools.httpFail(this.messageService, response);

      // reorder otherProducts by as 'ids'
      this.otherProducts = response.data;
      // .sort((a: IdNameDto, b: IdNameDto) => ids.indexOf(a.id) - ids.indexOf(b.id));

    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // createGrid
  get Shop()
  {
    return Shop;
  }


  reset()
  {
    this.product = Operation.deepCopy(this.initialProduct);
    this.initDummyStruct();

    this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Modification annulée'});
  }

  /*reset()
  {
    const changes = this.detectChanges();
    if (changes.count == 0)
    {
      this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Aucune modification'});
      return
    }

    const message = changes.count == 1
      ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
      : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

    ConfirmationServiceTools.newComplexFunction(this.confirmationService, this._reset, message);
  }*/

  // This function does the actual work of saving the changes to the database
  private async _save(changes: { diffObj: any, count: number })
  {
    let namespace: any = PatchSimpleProductDto;
    let endpoint = 'simpleproduct';
    if (this.product.productType === ProductType.Bundle)
    {
      namespace = PatchBundleDto;
      endpoint = 'bundle';
    }

    // start creating the patch object
    const shopSpecificChanges = changes.diffObj.shopSpecifics ?? []; // '?? []' is to prevent errors
    delete changes.diffObj.shopSpecifics; // remove it not to be included in patchProduct

    const patchProduct: PatchProductDto = namespace.build(changes.diffObj);
    const shopSpecificPatches: PatchShopSpecificDto[] = [];
    for (const shopSpecificChange of shopSpecificChanges)
    {
      if (Operation.countProperties(shopSpecificChange) > 1) // more than the id
        shopSpecificPatches.push(PatchShopSpecificDto.build(shopSpecificChange));
    }

    try
    {
      // Detect if patch is empty - more than 1 because of the id
      if (Operation.countProperties(patchProduct) > 1)
      {
        const response: AxiosResponse = await axios.patch(`${api}/${endpoint}/`, patchProduct);
        if (response.status !== 200)
          return MessageServiceTools.httpFail(this.messageService, response);
      }

      for (const shopSpecificPatch of shopSpecificPatches)
      {
        const response: AxiosResponse = await axios.patch(`${api}/shopSpecific/`, shopSpecificPatch);
        if (response.status !== 200)
          return MessageServiceTools.httpFail(this.messageService, response);
      }

      this.messageService.add({severity: 'info', summary: 'Enregistrer', detail: 'Modification enregistrée'});
      await this.fetchProduct(this.product.id);
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  save()
  {
    const changes = this.detectChanges();
    if (changes.count == 0)
    {
      this.messageService.add({severity: 'info', summary: 'Enregistrer', detail: 'Aucune modification'});
      return
    }

    ConfirmationServiceTools.new(this.confirmationService,
      this,
      this._save,
      `Toute donnée modifiée ne pourra être retrouvé. ${changes.count} modifications.`,
      changes);
  }

  // Some product fields are not directly model
  // This function does the bridge between the model and the product
  reformatProduct()
  {
    this.product.manufacturerId = this.dummyStruct.manufacturer.id; // manufacturer
    this.product.popularity = this.dummyStruct.popularity.id; // popularity

    if (this.product.productType == ProductType.Simple)
      this.simpleProduct.availability = this.dummyStruct.availability.id; // availability
  }

  // keep is a list of properties that should not be compared
  // should be keep in the diff
  // shouldn't be counted in the diff
  private _detectChanges(obj: any, initialObj: any, keep: string[]): { diffObj: any, count: number }
  {
    let count = 0;
    let diffObj: any = {};

    for (const key in obj)
    {
      if (keep.includes(key))
      {
        diffObj[key] = obj[key];
        continue;
      }

      if (Operation.isPrimitive(obj[key]))
      {
        if (obj[key] !== initialObj[key])
        {
          diffObj[key] = obj[key];
          count++;
        }
        continue;
      }

      if (Array.isArray(obj[key]))
      {
        diffObj[key] = [];
        const initialCount = count;
        for (let i = 0; i < obj[key].length; i++)
        {
          const changes = this._detectChanges(obj[key][i], initialObj[key][i], keep);
          count += changes.count;
          if (count > 0)
            diffObj[key].push(changes.diffObj);
        }
        // We don't want to keep the array if there are no changes
        if (initialCount === count)
          delete diffObj[key];

        continue
      }

      // Composed object
      const changes = this._detectChanges(obj[key], initialObj[key], keep);
      count += changes.count;
      if (count > 0)
        diffObj[key] = changes.diffObj;
    }

    return {diffObj: diffObj, count: count};
  }

  detectChanges(): { diffObj: any, count: number }
  {
    this.reformatProduct();
    return this._detectChanges(this.product, this.initialProduct, ['id']);
  }

  discountValue(): number
  {
    if (this.product == null || this.simpleProduct.discount == null)
      return 0;

    return this.simpleProduct.discount.value;
  }

  // Smart fields
  get purchasePrice()
  {
    if (this.product.productType === ProductType.Simple)
      return this.simpleProduct.cataloguePrice * (1 - this.discountValue());
    else
      return this.bundle.purchasePrice;
  }

  set purchasePrice(value: number)
  {
    if (this.simpleProduct.discount == null)
      return;

    this.simpleProduct.discount.value = 1 - value / this.simpleProduct.cataloguePrice;
  }

  getSalePriceIt(index: number): number
  {
    const deee: number = this.product.productType === ProductType.Simple
      ? this.simpleProduct.deee
      : 0;

    return this.purchasePrice * (this.product.shopSpecifics[index].km)
      * (1 - this.product.shopSpecifics[index].promotion)
      + deee;
  }

  setSalePriceIt(index: number, value: number): void
  {
    this.product.shopSpecifics[index].km =
      value / (this.purchasePrice * (1 - this.product.shopSpecifics[index].promotion));
  }
}
