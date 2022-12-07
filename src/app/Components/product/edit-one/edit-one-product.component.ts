import {Component, OnInit} from '@angular/core';
import {api} from "../../../GlobalUsings";
import axios from "axios";
import {MessageService} from "primeng/api";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpTools} from "../../../../utils/HttpTools";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ProductType} from "../../../../Enums/ProductType";
import {BundleDto} from "../../../../Dtos/ProductDtos/BundleDto/BundleDto";
import {SimpleProductDto} from "../../../../Dtos/ProductDtos/SimpleProductDtos/SimpleProductDto";
import {Operation} from "../../../../utils/Operation";

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

  // @ts-ignore
  additionalInformation: { manufacturers: IdNameDto[] } = {};
  additionalInformationFilter = this.additionalInformation;

  constructor(private messageService: MessageService)
  {
  }

  async ngOnInit()
  {
    let routedData = history.state;
    console.log(routedData);
    if (routedData.filteredIds == undefined || routedData.selectedId == undefined)
    {
      routedData.filteredIds = [6190, 6233, 6237]
      routedData.selectedId = routedData.filteredIds[0];
    }

    await this.fetchReferences(routedData.filteredIds);
    await this.fetchProduct(routedData.selectedId);
    await this.fetchManufacturers();
  }

  async goToProduct(id: number)
  {
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
    await this.fetchProduct(this.otherProducts[index].id);
  }

  async fetchProduct(id: number)
  {
    try
    {
      // Get the products itself
      const response = await axios.get(`${api}/product/${id}`);
      if (!HttpTools.IsCode(response.status, 200))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.product = response.data;
      this.initialProduct = Operation.deepCopy(this.product);
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
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
      this.additionalInformationFilter.manufacturers = [...response.data];
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // Look in additionalInformation
  completeMethod(event: any, fieldName: string)
  {
    // TODO: Make this work
    // @ts-ignore
    this.additionalInformationFilter[fieldName] = this.additionalInformation[fieldName]
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

}
