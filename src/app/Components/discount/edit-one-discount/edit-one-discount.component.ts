import {Component, OnInit} from '@angular/core';
import {Operation} from "../../../../utils/Operation";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {DiscountType} from "../../../../Enums/DiscountType";
import {
  LiteDistributorDiscountDto
} from "../../../../Dtos/DiscountDtos/DistributorDiscountDtos/LiteDistributorDiscountDto";
import {LiteDerogationDto} from "../../../../Dtos/DiscountDtos/DerogationDtos/LiteDerogationDto";
import {AxiosError} from "axios";
import {MessageServiceTools} from "../../../../utils/MessageServiceTools";
import {api} from "../../../GlobalUsings";
import {ConfirmationServiceTools} from "../../../../utils/ConfirmationServiceTools";
import {IChanges} from "../../../../Interfaces/IChanges";
import {IListItem} from "../../selectors/editable-list/editable-list.component";
import {HttpTools} from "../../../../utils/HttpTools";
import {Router} from "@angular/router";
import {GetDiscountsService} from "../../../Services/get-discounts.service";
import {InputNumberMode} from "../../input-components/input-number/InputNumberMode";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {CommonRequestService} from "../../../Services/common-request.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-edit-one-discount',
  templateUrl: './edit-one-discount.component.html',
  styleUrls: ['./edit-one-discount.component.css', '../../../../styles/button.css',
    '../../../../styles/main-color-background.css'],
  providers: [GetDiscountsService]
})
export class EditOneDiscountComponent implements OnInit
{
  otherDiscounts: IdNameDto[] = [];

  // @ts-ignore
  discount: LiteDistributorDiscountDto | LiteDerogationDto;
  //@ts-ignore
  initialDiscount: LiteDistributorDiscountDto | LiteDerogationDto;

  initialAdditionalInformation: { manufacturers: IdNameDto[], distributors: IdNameDto[] }
    = {manufacturers: [], distributors: []};

  dummyStruct: { manufacturer: IdNameDto, distributor: IdNameDto, distributors: IListItem[] } = {
    manufacturer: {id: 0, name: ""},
    distributor: {id: 0, name: ""},
    distributors: [],
  }

  additionalInformation = this.initialAdditionalInformation;

  dialItems: MenuItem[] = [];

  loading = true;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private getDiscountsService: GetDiscountsService,
              private httpClient: HttpClientWrapperService,
              private commonRequest: CommonRequestService,
              private http: HttpClientWrapperService)
  {
    this.dialItems = [
      {
        icon: 'pi pi-trash',
        command: () => this.delete()
      }];
  }

  async ngOnInit(): Promise<void>
  {
    let routedData: { selectedIds: number[], selectedId: number } = history.state;

    console.log('routedData', routedData);
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [3890, 1, 2];

    if (routedData.selectedId == undefined)
      routedData.selectedId = Operation.firstOrDefault(routedData.selectedIds) ?? 0;

    // push at the beginning of the array
    if (!routedData.selectedIds.includes(routedData.selectedId))
      routedData.selectedIds.unshift(routedData.selectedId);

    await this.fetchManufacturers(); // Do it first so the dummy struct is well initialized
    await this.fetchDistributors(); // Do it first so the dummy struct is well initialized
    await this.fetchOtherDiscounts(routedData.selectedIds);
    await this.fetchDiscount(routedData.selectedId);

    this.loading = false;
  }

  get DiscountType(): typeof DiscountType
  {
    return DiscountType;
  }

  async fetchDiscount(id: number)
  {
    try
    {
      const getTypeResponse = await this.http.get(`${api}/discount/type/${id}`);
      if (!HttpTools.IsValid(getTypeResponse.status))
        MessageServiceTools.httpFail(this.messageService, getTypeResponse);

      let endpoint: string = 'distributorDiscount';
      if (getTypeResponse.body == DiscountType.Derogation)
        endpoint = 'derogation';

      const response = await this.http.get(`${api}/${endpoint}/${id}`);
      if (!HttpTools.IsValid(response.status))
        MessageServiceTools.httpFail(this.messageService, response);

      this.initialDiscount = response.body;
      this.initialDiscount.discountType = getTypeResponse.body; // we set the type because it is not send by the server
      this.discount = Operation.deepCopy(this.initialDiscount);

      this.initDummyStruct();
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }
  }

  reset()
  {
    console.log('discount.value', this.discount.value);

    this.discount = Operation.deepCopy(this.initialDiscount);
    this.initDummyStruct();

    this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Modification annulée'});
  }

  // This function does the actual work of saving the changes to the database
  private async _save(changes: IChanges)
  {
    // If everything works
    if (await this.commonRequest.patchDiscount(changes.diffObj, this.discount.discountType))
    {
      this.messageService.add({severity: 'info', summary: 'Enregistrer', detail: 'Modification enregistrée'});
      await this.fetchDiscount(this.discount.id);
    }
  }

  save()
  {
    console.log('discount.value', this.discount.value);
    return;
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

  get derogation(): LiteDerogationDto
  {
    return this.discount as LiteDerogationDto;
  }

  get distributorDiscount(): LiteDistributorDiscountDto
  {
    return this.discount as LiteDistributorDiscountDto;
  }

  async fetchOtherDiscounts(ids: number[])
  {
    try
    {
      const response = await this.http.post(`${api}/discount/providers`, ids);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.otherDiscounts = response.body;
      this.otherDiscounts.forEach(d => d.name = `${d.name} (${d.id})`);

      // reorder otherProducts by as 'ids'
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.networkError(this.messageService, e.message);
    }
  }

  reformatDiscount()
  {

    if (this.discount.discountType == DiscountType.Derogation)
    {
      this.derogation.manufacturerId = this.dummyStruct.manufacturer.id;
      this.derogation.distributorIds = this.dummyStruct.distributors.map(d => d.id);
    }
    else if (this.discount.discountType == DiscountType.Distributor)
    {
      this.distributorDiscount.distributorId = this.dummyStruct.distributor.id;
    }
  }

  detectChanges(): { diffObj: any, count: number }
  {
    this.reformatDiscount();
    return Operation.detectChanges(this.discount, this.initialDiscount, ['id']);
  }

  async fetchManufacturers()
  {
    const manufacturers: IdNameDto[] | void = await this.commonRequest.fetchManufacturers();

    this.additionalInformation.manufacturers = manufacturers;
    this.initialAdditionalInformation.manufacturers = Operation.deepCopy(manufacturers);
  }

  async fetchDistributors()
  {
    const distributors: IdNameDto[] | void = await this.commonRequest.fetchDistributors();

    this.additionalInformation.distributors = distributors;
    this.initialAdditionalInformation.distributors = Operation.deepCopy(distributors);
  }

  private initDummyStruct()
  {
    if (this.discount.discountType == DiscountType.Derogation)
    {
      this.dummyStruct.manufacturer = this.additionalInformation.manufacturers
        .find(x => x.id == this.derogation.manufacturerId)!;

      this.dummyStruct.distributors = this.additionalInformation.distributors
        .filter(x => this.derogation.distributorIds.includes(x.id))
        .map(d => {return {id: d.id, label: d.name}});
    }

    if (this.discount.discountType == DiscountType.Distributor)
    {
      this.dummyStruct.distributor = this.additionalInformation.distributors
        .find(x => x.id == this.distributorDiscount.distributorId)!;
    }
  }

  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = Operation.completeMethod(event.query, // @ts-ignore
      this.initialAdditionalInformation[fieldName]);
  }

  async delete(): Promise<void>
  {
    if (!await ConfirmationServiceTools.newBlocking(this.confirmationService,
      "Êtes-vous sur de supprimer ce produit ? Cette action est irréversible !"))
      return;

    try
    {
      const response: HttpResponse<any> = await this.http.delete(`${api}/discount/${this.discount.id}`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      // remove this product from the list
      this.otherDiscounts = this.otherDiscounts.filter(p => p.id != this.discount.id);
      this.getDiscountsService.refresh(); // reload the discounts references

      if (this.otherDiscounts.length > 0)
        await this.fetchDiscount(this.otherDiscounts[0].id);
      else
        await this.router.navigate(['/discount/filter']);

    } catch (e: any | AxiosError)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  get InputNumberMode(): typeof InputNumberMode
  {
    return InputNumberMode;
  }
}
