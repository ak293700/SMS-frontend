import {Component, Input} from '@angular/core';

/*
  * This component is used to display the filter form.
  * It shows the results of the filter below it.
  * The fields in the filter and the table can be different.
 */

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent
{
  // We do not add the photo field in the header because it is mange differently.
  // Do that to display markup instead of text.
  readonly productsHeader = [
    {
      label: 'Reference produit',
      field: 'productReference',
    },
    {
      label: 'Nom ElecProShop',
      field: 'name',
    },
    {
      label: 'Id Prestashop',
      field: 'idPrestashop',
    },
    {
      label: 'Marque',
      field: 'brand',
    },
    {
      label: 'Catégorie principale',
      field: 'mainCategory',
    },
    {
      label: 'Famille fournisseur',
      field: 'supplierFamily',
    },
    {
      label: 'Actif',
      field: 'active',
    },
    {
      label: 'Popularité',
      field: 'popularity',
    },
    {
      label: 'Type de produit',
      field: 'productType',
    },
  ];
  readonly productsData = [
    {
      photo: 'https://cdn3.elecproshop.com/36742-medium_default/interrupteur-commande-vmc-vitesse-1-vitesse-2.jpg',
      productReference: "67001",
      name: "Interrupteur Commande VMC - 2 Vitesse Céliane",
      idPrestashop: "1226 | 1226",
      mainCategory: "Appareillage Céliane à composer",
      supplierFamily: "Non défini",
      active: "Oui | Oui",
      popularity: "Level4",
      productType: "Simple",
      brand: "Legrand",
    },
    {
      photo: 'https://cdn3.elecproshop.com/35498-medium_default/double-va-et-vient.jpg',
      productReference: "67001D",
      name: "Double Interrupteur Va Et Vient Céliane",
      idPrestashop: "10184 | 10184",
      mainCategory: "Appareillage Céliane à composer",
      supplierFamily: "Non défini",
      active: "Oui | Oui",
      popularity: "Level4",
      productType: "Bundle",
      brand: "Legrand",
    },
    {
      photo: 'https://cdn2.elecproshop.com/32255-medium_default/radiateur-electrique-a-fluide-750-w-bilbao-3.jpg',
      productReference: "T493821",
      name: "Radiateur Bilbao 3 - 750W - Fluide Caloporteur",
      idPrestashop: "9510 | 96193",
      mainCategory: "Radiateurs à inertie fluide",
      supplierFamily: "Non défini",
      active: "Oui | Oui",
      popularity: "Level1",
      productType: "Simple",
      brand: "Thermor",
    }
  ];
  selectedProducts: any[] = [];

  // Private we use getter and setter to manipulate it.
  _displayedProductHeader = this.productsHeader;

  @Input() get displayedProductHeader(): any[]
  {
    // remove @Input() from function signature
    return this._displayedProductHeader;
  }

  set displayedProductHeader(val: any[])
  {
    // restore original order
    this._displayedProductHeader = this.productsHeader
      .filter(col => val.includes(col));
  }
}
