import {Component, OnInit} from '@angular/core';
import {Product} from "../../../../Entities/ProductEntities/Product";
import {api} from "../../../GlobalUsings";
import axios from "axios";
import {MessageService} from "primeng/api";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {HttpTools} from "../../../../utils/HttpTools";
import {IdNameDto} from "../../../../Dtos/IdNameDto";

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
  product: Product;

  // @ts-ignore
  additionalInformation: {
    manufacturers: IdNameDto[]
    productPopularity: any
  } = {};
  additionalInformationFilter = this.additionalInformation;

  constructor(private messageService: MessageService)
  {
    this.additionalInformation.productPopularity = {0: "Level0", 1: "Level1", 2: "Level2", 3: "Level3", 4: "Level4"};
  }

  async ngOnInit()
  {
    await this.fetchProduct(6190);
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

      // Fetch the shop specifics
      this.product.shopSpecifics = [];
      for (let id of this.product.shopSpecificsId)
        this.product.shopSpecifics.push(await this.fetchShopSpecific(id));

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

  async fetchShopSpecific(id: number)
  {
    try
    {
      const response = await axios.get(`${api}/product/${id}/shopSpecifics`);
      if (!HttpTools.IsCode(response.status, 200))
        return MessageServiceTools.httpFail(this.messageService, response);

      return response.data;
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

}
