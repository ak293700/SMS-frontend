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

@Component({
  selector: 'app-edit-one-product',
  templateUrl: './edit-one-product.component.html',
  styleUrls: ['./edit-one-product.component.css'],
  providers: [ConfirmationService]
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

      this.confirmDialog(this.fetchProduct, message, id);
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

  // Before doing a risky operation, ask for confirmation
  confirmDialog(f: (p: any) => any, message: string, ...params: any[])
  {
    this.confirmationService.confirm({
      message: message, accept: async () =>
      {
        // if it returns a promise, wait for it to finish
        // @ts-ignore
        await this[f.name](...params);
      }
    });

  }

  private _reset()
  {
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

    this.confirmDialog(this._reset, message);
  }

  // This function does the actual work of saving the changes to the database
  private async _save(changes: { diffObj: any, count: number })
  {
    console.log('_save', changes);
    if (this.product.productType !== ProductType.Simple)
      return;

    // build the PatchSimpleProductDto
    const patch: PatchSimpleProductDto = {id: this.product.id};
    for (const [key, value] of Object.entries(changes.diffObj))
    {
      // @ts-ignore
      patch[key] = value;
    }

    try
    {
      const response: AxiosResponse = await axios.patch(`${api}/simpleproduct/`, patch);
      if (response.status !== 200)
        return MessageServiceTools.httpFail(this.messageService, response);

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

    this.confirmDialog(this._save,
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

  private _detectChanges(obj: any, initialObj: any): { diffObj: any, count: number }
  {
    let count = 0;
    let diffObj: any = {};

    for (const key in obj)
    {
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
          const changes = this._detectChanges(obj[key][i], initialObj[key][i]);
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
      const changes = this._detectChanges(obj[key], initialObj[key]);
      count += changes.count;
      if (count > 0)
        diffObj[key] = changes.diffObj;
    }

    return {diffObj: diffObj, count: count};
  }

  detectChanges(): { diffObj: any, count: number }
  {
    this.reformatProduct();
    return this._detectChanges(this.product, this.initialProduct);
  }
}
