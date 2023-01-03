import {Component, OnInit} from '@angular/core';
import {api} from "../../../GlobalUsings";
import {AxiosError} from "axios";
import {ConfirmationService, MenuItem, MessageService, PrimeIcons} from "primeng/api";
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
import {PricingTool} from "../../../../utils/PricingTool";
import {IChanges} from "../../../../Interfaces/IChanges";
import {IListItem} from "../../selectors/editable-list/editable-list.component";
import {ProductReferencesService} from "../../../Services/product-references.service";
import {CreateBundleItemDto} from "../../../../Dtos/ProductDtos/BundleDto/BundleItemDto/CreateBundleItemDto";
import {LiteDiscountDto} from "../../../../Dtos/DiscountDtos/LIteDiscountDto";
import {Router} from "@angular/router";
import {ShopSpecificDto} from "../../../../Dtos/ShopSpecificDtos/ShopSpecificDto";
import {CreateShopSpecificDto} from "../../../../Dtos/ShopSpecificDtos/CreateShopSpecificDto";
import {HttpClientWrapperService} from "../../../Services/http-client-wrapper.service";
import {CommonRequestService} from "../../../Services/common-request.service";
import {CheckingTools} from "../../../../utils/CheckingTools";

@Component({
  selector: 'app-edit-one-product',
  templateUrl: './edit-one-product.component.html',
  styleUrls: ['./edit-one-product.component.css', '../../../../styles/button.css',
    '../../../../styles/main-color-background.css'],
  providers: [ProductReferencesService]
})
export class EditOneProductComponent implements OnInit
{
  discountContextMenuItems: MenuItem[];

  discountOverlayVisible: boolean = false;

  otherProducts: IdNameDto[] = [];

  allProductReferences: IdNameDto[] = [];

  // @ts-ignore
  product: SimpleProductDto | BundleDto;
  // Describe the product as it is at the moment in the db
  // @ts-ignore
  initialProduct: SimpleProductDto | BundleDto;

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

  allDiscounts: IdNameDto[] = [];

  // Use to ngModel some product fields
  dummyStruct: {
    manufacturer: IdNameDto, popularity: IdNameDto,
    availability: IdNameDto, bundleItems: IListItem[]
    selectedDiscount: IListItem | undefined
  } = {
    manufacturer: {id: 0, name: ""},
    popularity: {id: 0, name: ""},
    availability: {id: 0, name: ""},
    bundleItems: [],
    selectedDiscount: undefined
  }

  bundleItemAdditionalField: { fieldName: string, label: string, type: string, default?: any }[] = [];

  loading: boolean = true;

  dialItems: MenuItem[] = [
    {
      icon: PrimeIcons.TRASH,
      command: () => this.delete()
    },
    {
      icon: PrimeIcons.UPLOAD,
      command: () => this.forcePrestaPush()
    },
    {
      icon: PrimeIcons.REFRESH,
      command: () => this.refresh()
    },
    {
      icon: PrimeIcons.PLUS,
      command: () => this.newShopSpecificRequest()
    },
  ];


  newShopStruct: {
    visible: boolean,
    availableShop: IdNameDto[],
    selectedShop: IdNameDto | undefined,
  } = {
    visible: false,
    availableShop: [],
    selectedShop: undefined
  }


  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private productReferencesService: ProductReferencesService,
              private router: Router,
              private httpClient: HttpClientWrapperService,
              private commonRequest: CommonRequestService,
              private http: HttpClientWrapperService)
  {
    this.discountContextMenuItems = [
      {
        label: 'Éditer',
        icon: 'pi pi-pencil',
        command: this.showDiscountOverlay.bind(this)
      }
    ];

    this.additionalInformation.popularities = ProductPopularity.toIdNameDto();
    this.additionalInformation.availabilities = Availability.toIdNameDto();
    this.initialAdditionalInformation = Operation.deepCopy(this.additionalInformation);

    this.bundleItemAdditionalField = [
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
    let routedData: { selectedIds: number[], selectedId: number } = history.state;
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [7909, 7910, 7911, 7912];
    // routedData.selectedIds = [7021, 7911, 6190, 6233, 6237, 7257, 2863];

    if (routedData.selectedId == undefined)
      routedData.selectedId = Operation.firstOrDefault(routedData.selectedIds) ?? 0;

    // push at the beginning of the array
    if (!routedData.selectedIds.includes(routedData.selectedId))
      routedData.selectedIds.unshift(routedData.selectedId);

    await this.fetchManufacturers(); // Do it first so the dummy struct is well initialized
    await this.fetchReferences(routedData.selectedIds);
    await this.fetchAllDiscounts();
    await this.fetchProduct(routedData.selectedId);

    this.loading = false;
  }

  showDiscountOverlay()
  {
    this.discountOverlayVisible = true;
  }

  async fetchProduct(id: number)
  {
    try
    {
      // Get the products itself
      const response = await this.httpClient.get(`${api}/product/${id}`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.initialProduct = response.body;
      this.product = Operation.deepCopy(this.initialProduct);

      await this.fetchAvailableDiscounts();
      this.initDummyStruct();
    } catch (e: any)
    {
      console.log('error', e);
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // fetch the discount available for the product
  async fetchAvailableDiscounts()
  {
    if (this.product.productType !== ProductType.Simple)
    {
      this.additionalInformation.availableDiscounts = [];
      return;
    }

    try
    {
      // fetch the discount available for the product
      const response = await this.http.get(`${api}/discount/available/${this.product.id}`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.initialAdditionalInformation.availableDiscounts = response.body
        .map((d: IdNameDto) => ({id: d.id, label: d.name}));
      this.additionalInformation.availableDiscounts = Operation.deepCopy(this.initialAdditionalInformation.availableDiscounts);
    } catch (e: any | AxiosError)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // fetch all the discounts
  async fetchAllDiscounts()
  {
    try
    {
      const response = await this.http.get(`${api}/discount`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.allDiscounts = response.body;
    } catch (e: any | AxiosError)
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

      if (this.simpleProduct.discount != null)
      {
        this.dummyStruct.selectedDiscount = this.additionalInformation.availableDiscounts
          .find(x => x.id == this.simpleProduct.discount!.id)!;
      }
      else
      {
        this.dummyStruct.selectedDiscount = undefined;
      }
    }
    else if (this.product.productType == ProductType.Bundle)
    {
      this.dummyStruct.bundleItems = this.bundle.items
        .map(item => ({
          id: item.productId,
          label: Operation.first(this.allProductReferences, p => p.id == item.productId).name,
          additionalFields: {quantity: item.quantity}
        }));
    }
  }

  async fetchManufacturers()
  {
    const manufacturers: IdNameDto[] | void = await this.commonRequest.fetchManufacturers();

    this.additionalInformation.manufacturers = manufacturers;
    this.initialAdditionalInformation.manufacturers = Operation.deepCopy(manufacturers);
  }

  // Look in additionalInformation
  completeMethod(event: any, fieldName: string)
  {
    // @ts-ignore
    this.additionalInformation[fieldName] = Operation.completeMethod(event.query, // @ts-ignore
      this.initialAdditionalInformation[fieldName]);
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
    this.allProductReferences = await this.productReferencesService.getProductReferences();

    this.otherProducts = this.allProductReferences
      .filter((e: IdNameDto) => ids.includes(e.id))
      .sort((a: IdNameDto, b: IdNameDto) => ids.indexOf(a.id) - ids.indexOf(b.id));
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

    this.additionalInformation.availableDiscounts =
      Operation.deepCopy(this.initialAdditionalInformation.availableDiscounts);

    this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Modification annulée'});
  }

  // This function does the actual work of saving the changes to the database
  private async _save(changes: IChanges)
  {
    this.loading = true;
    try
    {
      if (changes.diffObj.discount !== undefined)
      {
        const newDiscount = changes.diffObj.discount;
        if (newDiscount !== this.initialSimpleProduct.discount)
        {
          if (newDiscount == null) // if set to null
            changes.diffObj.selectedDiscountId = null;
          else if (changes.diffObj.discount.id !== this.initialSimpleProduct.discount?.id) // if set to another discount
            changes.diffObj.selectedDiscountId = changes.diffObj.discount.id;
        }
      }

      if (!await this.saveDiscount(changes.diffObj.discount))
        return this.messageService.add({
          severity: 'error', summary: 'Erreur',
          detail: 'Erreur lors de la de la sauvegarde de la remise'
        });

      if (!await this.saveDiscountCanUse(changes.diffObj.availableDiscounts))
        return this.messageService.add({
          severity: 'error', summary: 'Erreur',
          detail: 'Erreur lors de la de la sauvegarde des remises disponible'
        });

      let namespace: any = PatchSimpleProductDto;
      let endpoint = 'simpleproduct';
      if (this.product.productType === ProductType.Bundle)
      {
        namespace = PatchBundleDto;
        endpoint = 'bundle';
      }

      // start creating the patch object
      let shopSpecificChanges = changes.diffObj.shopSpecifics ?? []; // '?? []' is to prevent errors
      delete changes.diffObj.shopSpecifics; // remove it not to be included in patchProduct

      // split shopSpecificChanges whether id == -1 or not
      const newShopSpecifics = shopSpecificChanges.filter((ss: any) => ss.id == -1);
      shopSpecificChanges = shopSpecificChanges.filter((ss: any) => ss.id != -1);

      const patchProduct: PatchProductDto = namespace.build(changes.diffObj);
      const shopSpecificPatches: PatchShopSpecificDto[] = [];

      for (const shopSpecificChange of shopSpecificChanges)
      {
        if (Operation.countProperties(shopSpecificChange) > 1) // more than the id
          shopSpecificPatches.push(PatchShopSpecificDto.build(shopSpecificChange));
      }

      const bundleItems: CreateBundleItemDto[] = changes.diffObj.items;
      if (bundleItems !== undefined) // @ts-ignore
        bundleItems.forEach(item => delete item.id); // so bundleItems is really a CreateBundleItemDto[]

      // Detect if patch is empty - more than 1 because of the id
      if (Operation.countProperties(patchProduct) > 1)
      {
        const response = await this.http.patch(`${api}/${endpoint}/`, patchProduct);
        if (!HttpTools.IsValid(response.status))
          return MessageServiceTools.httpFail(this.messageService, response);
      }

      for (const shopSpecificPatch of shopSpecificPatches)
      {
        // Todo: without {headers: {'Content-Type': 'application/json'}}
        const response = await this.http.patch(`${api}/api/ShopSpecific`, shopSpecificPatch,);
        if (!HttpTools.IsValid(response.status))
          return MessageServiceTools.httpFail(this.messageService, response);
      }

      if (!await this.createShopSpecific(newShopSpecifics))
        return this.messageService.add({
          severity: 'error', summary: 'Erreur',
          detail: 'Erreur lors de la de la sauvegarde du nouveau shopSpecific'
        });

      if (this.product.productType === ProductType.Bundle && bundleItems !== undefined)
      {
        const response = await this.http.post(`${api}/bundle/items/${patchProduct.id}`, bundleItems);
        if (!HttpTools.IsValid(response.status))
          return MessageServiceTools.httpFail(this.messageService, response);
      }

      this.messageService.add({severity: 'info', summary: 'Enregistrer', detail: 'Modification enregistrée'});
      await this.fetchProduct(this.product.id);
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    } finally
    {
      this.loading = false;
    }
  }

  save()
  {
    const changes = this.detectChanges();
    console.log('changes', changes);

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

  // return can everything went well
  async saveDiscount(discount: any): Promise<boolean>
  {
    if (discount == undefined)
      return true;

    // A derogation cannot be modified in the product section
    if (this.simpleProduct.discount?.discountType == discount.Derogation)
    {
      this.messageService.add({
        severity: 'warn', summary: 'Dérogation',
        detail: "Impossible de modifier la valeur d'une dérogation"
      });
      return false;
    }

    const id = discount.id;
    let numberOfProductInUse;
    try
    {
      // Get the number of product that use this discount
      const response = await this.http.get(`${api}/discount/productsInUse/number/${id}`, discount);
      if (!HttpTools.IsValid(response.status))
      {
        MessageServiceTools.httpFail(this.messageService, response);
        return false;
      }

      numberOfProductInUse = response.body;
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
      return false
    }

    // Set to false because if only use by one product, it will not be split
    let split: boolean = false;

    // If the discount is used by more than one product, ask for confirmation
    if (numberOfProductInUse > 1)
    {
      if (!await ConfirmationServiceTools.newBlocking(this.confirmationService,
        `${numberOfProductInUse} produits utilisent cette remise. Voulez-vous continuer ?`))
      {
        this.messageService.add({severity: 'info', summary: 'Annuler', detail: 'Enregistrement annulée'});
        return false;
      }

      split = await ConfirmationServiceTools.newBlocking(this.confirmationService,
        `Voulez-vous appliquer la modification à tous les produits ? (Sinon créer une nouvelle pour celui-ci)`);
    }

    if (split)
    {
      // Split the discount
    }
    else // Save the discount
    {
      if (!await this.commonRequest.patchDiscount(discount, this.simpleProduct.discount?.discountType!))
        return false;
    }

    return true;
  }

  async saveDiscountCanUse(availableDiscounts: IListItem[]): Promise<boolean>
  {
    if (availableDiscounts == undefined)
      return true;

    try
    {
      const ids = availableDiscounts.map(d => d.id);
      const response = await this.http.patch(`${api}/simpleProduct/availableDiscounts/${this.product.id}`, ids);
      if (!HttpTools.IsValid(response.status))
      {
        MessageServiceTools.httpFail(this.messageService, response);
        return false;
      }

    } catch (e: any | AxiosError)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
      return false;
    }

    return true;
  }

  async createShopSpecific(newShopSpecifics: CreateShopSpecificDto[]): Promise<boolean>
  {
    for (const newShopSpecific of newShopSpecifics)
    {
      try
      {
        const response = await this.http.post(`${api}/shopSpecific/${this.product.id}`, newShopSpecific);
        if (!HttpTools.IsValid(response.status))
        {
          MessageServiceTools.httpFail(this.messageService, response);
          return false;
        }
      } catch (e: any | AxiosError)
      {
        MessageServiceTools.axiosFail(this.messageService, e);
        return false;
      }
    }

    return true;
  }

  // Some product fields are not directly model
  // This function does the bridge between the model and the product
  reformatProduct()
  {
    this.product.manufacturerId = this.dummyStruct.manufacturer.id; // manufacturer
    this.product.popularity = this.dummyStruct.popularity.id; // popularity

    if (this.product.productType == ProductType.Simple)
    {
      this.simpleProduct.availability = this.dummyStruct.availability.id; // availability
      if (this.simpleProduct.discount === undefined)
        this.simpleProduct.discount = undefined; // discountType
      this.simpleProduct.selectedDiscountId = this.dummyStruct.selectedDiscount?.id ?? null; // discount
    }
    else if (this.product.productType == ProductType.Bundle)
    {
      this.bundle.items = this.dummyStruct.bundleItems
        .map((item: IListItem) => {
          return {id: -1, productId: item.id, quantity: item.additionalFields.quantity}
        }); // bundle items
    }
  }

  detectChanges(): IChanges
  {
    this.reformatProduct();

    const changes: IChanges[] = [];

    const product = Operation.deepCopy(this.product);
    const initialProduct = Operation.deepCopy(this.initialProduct);

    // determine which shop specific are new
    const newShopSpecific = product.shopSpecifics.filter(ss => ss.id == -1);
    product.shopSpecifics = product.shopSpecifics.filter(ss => ss.id != -1);
    initialProduct.shopSpecifics = initialProduct.shopSpecifics.filter(ss => ss.id != -1);

    if (newShopSpecific.length > 0)
      changes.push({diffObj: {shopSpecifics: newShopSpecific}, count: newShopSpecific.length});

    // push every change into the changes array
    changes.push(CheckingTools.detectChanges(product, initialProduct, ['id']));

    if (this.product.productType == ProductType.Simple)
    {
      const tmp = CheckingTools.detectChanges(this.additionalInformation.availableDiscounts,
        this.initialAdditionalInformation.availableDiscounts, ['id']);

      tmp.diffObj = {availableDiscounts: tmp.diffObj};
      changes.push(tmp);
    }

    // do deepmerge on all changes
    return {
      diffObj: Operation.deepMerge(changes.map(change => change.diffObj)),
      count: changes.reduce((acc, change) => acc + change.count, 0)
    }
  }

  discountValue(): number
  {
    if (this.product == null || this.simpleProduct.discount == null)
      return 0;

    return this.simpleProduct.discount.value;
  }

  // Smart fields
  get purchasePrice(): number
  {
    if (this.product.productType === ProductType.Bundle)
      return this.bundle.purchasePrice;

    const discount: LiteDiscountDto | undefined = this.simpleProduct.discount;
    if (discount == null)
      return this.simpleProduct.cataloguePrice;

    if (discount.isNetPrice)
      return discount.value;

    return this.simpleProduct.cataloguePrice * (1 - this.discountValue());
  }

  // value: the newly set purchase price
  set purchasePrice(purchasePrice: number)
  {
    const discount: LiteDiscountDto | undefined = this.simpleProduct.discount;
    if (discount == null)
      return;

    if (discount.isNetPrice)
      discount.value = purchasePrice;
    else
      discount.value = 1 - purchasePrice / this.simpleProduct.cataloguePrice;
  }

  getSalePriceIt(index: number): number
  {
    return PricingTool
      .calculateSalePriceIt(
        this.purchasePrice,
        this.product.shopSpecifics[index].km,
        this.product.shopSpecifics[index].promotion,
        this.product.deee);
  }

  setSalePriceIt(index: number, value: number): void
  {
    const nominator = value / 1.2 - this.product.deee;
    const denominator = this.purchasePrice * (1 - this.product.shopSpecifics[index].promotion);
    this.product.shopSpecifics[index].km = nominator / denominator;
  }

  // return the margin rate in percent
  getMarginRate(index: number): number
  {
    const salePriceEt = this.getSalePriceIt(index) / 1.2;
    return PricingTool.calculateMarginRate(salePriceEt, this.purchasePrice);
  }

  setMarginRate(index: number, marginRate: number): void
  {
    const salePriceEt = this.purchasePrice / (1 - marginRate);

    this.setSalePriceIt(index, salePriceEt * 1.2);
  }


  // it will update the discount field
  // so when select a new discount he sees the changes
  async onSelectDiscountClose()
  {
    if (this.product.productType != ProductType.Simple)
      return;

    // discount were or has been set to null
    if (this.dummyStruct.selectedDiscount == undefined)
    {
      this.simpleProduct.discount = undefined;
      return
    }

    try
    {
      const response = await this.http.get(`${api}/discount/${this.dummyStruct.selectedDiscount.id}`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.simpleProduct.discount = response.body;
    } catch (e: any)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  // delete the product
  async delete(): Promise<void>
  {
    if (!await ConfirmationServiceTools.newBlocking(this.confirmationService,
      "Êtes-vous sur de supprimer ce produit ? Cette action est irréversible !"))
      return;

    try
    {
      const response = await this.http.delete(`${api}/product/${this.product.id}`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      // remove this product from the list
      this.otherProducts = this.otherProducts.filter(p => p.id != this.product.id);
      this.productReferencesService.refresh(); // reload the product references

      if (this.otherProducts.length > 0)
        await this.fetchProduct(this.otherProducts[0].id);
      else
        await this.router.navigate(['/product/filter']);

    } catch (e: any | AxiosError)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }

  newShopSpecificRequest(): void
  {
    // get the key value of the Shop enum, and only that (so not the namespace)
    // filter, so it keep only the shop that are not already created
    this.newShopStruct.availableShop = Object
      .values(Shop)
      .filter(e => typeof e === 'string')
      .map((e, i) => { return {id: i, name: e as string} })
      .filter(e => Operation.firstOrDefault(this.product.shopSpecifics,
        ss => ss.shop === e.id) == undefined);

    if (this.newShopStruct.availableShop.length == 0)
    { // if the product is already created on every website we can't create a new one
      return this.messageService.add({
        severity: 'warn',
        summary: 'Opération impossible',
        detail: 'Tout les shops sont déjà créés'
      });
    }

    this.newShopStruct.visible = true;
  }

  // create a new shop specific
  createNewShopSpecific(cancel: boolean = false): void
  {
    this.newShopStruct.visible = false; // doing that there will call
    if (cancel)
      return;

    if (this.newShopStruct.selectedShop == undefined)
      return this.messageService.add({
        'severity': 'erreur',
        'summary': 'Opération impossible',
        'detail': 'Aucun shop sélectionné'
      });

    let name = '';
    let km = 1.34;
    if (this.product.shopSpecifics.length > 0)
    {
      const firstShop = this.product.shopSpecifics[0];
      name = firstShop.name;
      km = firstShop.km * 0.95;
    }

    // push a new shop specific
    const newShopSpecific: ShopSpecificDto = {
      id: -1,
      name: name,
      idPrestashop: null,
      shop: this.newShopStruct.selectedShop.id,
      km: km,
      promotion: 0,
      active: false,
      categoriesId: []
    };

    this.initialProduct.shopSpecifics.push(newShopSpecific);
    this.product.shopSpecifics.push(Operation.deepCopy(newShopSpecific));
  }

  async refresh()
  {
    this.loading = true;
    await this.fetchManufacturers(); // Do it first so the dummy struct is well initialized
    await this.productReferencesService.refresh()
    await this.fetchReferences(this.otherProducts.map(p => p.id));
    await this.fetchAllDiscounts();
    await this.fetchProduct(this.product.id);
    this.loading = false;
  }

  async forcePrestaPush()
  {
    try
    {
      const response = await this.http.post(`${api}/product/force_presta_update/${this.product.id}`);
      if (!HttpTools.IsValid(response.status))
        return MessageServiceTools.httpFail(this.messageService, response);

      this.messageService.add(
        {
          'severity': 'info',
          'summary': 'Opération en attente',
          'detail': 'Le produit va être mis à jour sur Prestashop sous peu'
        });

    } catch (e: any | AxiosError)
    {
      MessageServiceTools.axiosFail(this.messageService, e);
    }
  }
}
