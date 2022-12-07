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

@Component({
  selector: 'app-edit-one-product',
  templateUrl: './edit-one-product.component.html',
  styleUrls: ['./edit-one-product.component.css']
})
export class EditOneProductComponent implements OnInit
{
  otherProducts: { id: number, productReference: string }[] = [
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
    {id: 2, productReference: "1"},
    {id: 1, productReference: "2"},
    {id: 2, productReference: "3"},
    {id: 1, productReference: "4"},
    {id: 2, productReference: "5"},
    {id: 1, productReference: "6"},
    {id: 2, productReference: "7"},
  ];

  // @ts-ignore
  product: SimpleProductDto | BundleDto;

  // @ts-ignore
  additionalInformation: { manufacturers: IdNameDto[] } = {};
  additionalInformationFilter = this.additionalInformation;

  constructor(private messageService: MessageService)
  {
  }

  async ngOnInit()
  {
    await this.fetchProduct(501);
    await this.fetchManufacturers();
  }

  goToProduct(id: number)
  {
    console.log("Go to product " + id);
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
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }

    console.log('this.product', this.product);
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

}
