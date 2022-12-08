import {Component, OnInit} from '@angular/core';
import {api} from "../../../GlobalUsings";
import axios, {AxiosResponse} from "axios";
import {ConfirmationService, MessageService} from "primeng/api";
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
import {ComfirmationServiceTools} from "../../../../utils/ComfirmationServiceTools";

@Component({
  selector: 'app-edit-one-product',
  templateUrl: './edit-one-product.component.html',
  styleUrls: ['./edit-one-product.component.css']
})
export class EditOneProductComponent implements OnInit
{
  otherProducts: IdNameDto[] = [];

  // @ts-ignore
  product: SimpleProductDto | BundleDto;
  // Describe the product as it is at the moment in the db
  // @ts-ignore
  initialProduct: SimpleProductDto | BundleDto;

  additionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
    availabilities: IdNameDto[]
  } = {manufacturers: [], popularities: [], availabilities: []};

  initialAdditionalInformation: {
    manufacturers: IdNameDto[],
    popularities: IdNameDto[],
    availabilities: IdNameDto[]
  } = {
    manufacturers: [],
    popularities: [],
    availabilities: []
  };

  // Use to ngModel some product fields
  dummyStruct: { manufacturer: IdNameDto, popularity: IdNameDto, availability: IdNameDto } = {
    manufacturer: {id: 0, name: ""},
    popularity: {id: 0, name: ""},
    availability: {id: 0, name: ""}
  }

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {
    this.additionalInformation.popularities = ProductPopularity.toIdNameDto();
    this.additionalInformation.availabilities = Availability.toIdNameDto();
    this.initialAdditionalInformation = Operation.deepCopy(this.additionalInformation);
  }

  async ngOnInit()
  {
    let routedData: { selectedIds: number[], selectedId: number } = history.state;
    if (routedData.selectedIds == undefined || routedData.selectedId == undefined)
    {
      routedData.selectedIds = [6190, 6233, 6237, 7257, 2863]
      routedData.selectedId = routedData.selectedIds[0];
    }

    // push at the beginning of the array
    if (!routedData.selectedIds.includes(routedData.selectedId))
      routedData.selectedIds.unshift(routedData.selectedId);

    await this.fetchManufacturers(); // Do it first so the dummy struct is well initialized
    await this.fetchReferences(routedData.selectedIds);
    await this.fetchProduct(routedData.selectedId);
  }

  async goToProduct(id: number)
  {
    const changes = this.detectChanges();
    if (changes.count > 0)
    {
      const message = changes.count == 1
        ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
        : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

      ComfirmationServiceTools.new(this.confirmationService, this.fetchProduct, message, id);
    }
    else
      await this.fetchProduct(id);
  }

  async goToFollowingProduct(step: number)
  {
    let index = this.otherProducts.findIndex(x => x.id == this.product.id);
    if (index == -1)
    {
      this.messageService.add({
        severity: 'warn', summary: 'Oups une erreur est survenue',
        detail: 'impossible de naviguer au prochain produit'
      });
      return;
    }

    index = Operation.modulo(index + step, this.otherProducts.length);
    await this.goToProduct(this.otherProducts[index].id);
  }

  async fetchProduct(id: number)
  {
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

  get ProductType()
  {
    return ProductType;
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
      this.otherProducts = response.data;
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


  private _reset()
  {
    console.log(this.initialProduct);
    this.product = Operation.deepCopy(this.initialProduct);
    this.initDummyStruct();

    this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Modification annulée'});
  }

  reset()
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

    ComfirmationServiceTools.new(this.confirmationService, this._reset, message);
  }

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

    ComfirmationServiceTools.new(this.confirmationService,
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
}
