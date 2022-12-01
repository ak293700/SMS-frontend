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
  ];

  // Private we use getter and setter to manipulate it.
  _selectedProductHeader = this.productsHeader;

  readonly productsData = [
    {
      photo: 'https://cdn3.elecproshop.com/36742-medium_default/interrupteur-commande-vmc-vitesse-1-vitesse-2.jpg',
      productReference: "67001",
      name: "Interrupteur Commande VMC - 2 Vitesse Céliane",
    },
    {
      photo: 'https://cdn3.elecproshop.com/35498-medium_default/double-va-et-vient.jpg',
      productReference: "67001D",
      name: "Double Interrupteur Va Et Vient Céliane",
    },
    {
      photo: 'https://cdn2.elecproshop.com/32255-medium_default/radiateur-electrique-a-fluide-750-w-bilbao-3.jpg',
      productReference: "T493821",
      name: "Radiateur Bilbao 3 - 750W - Fluide Caloporteur",
    }
  ];

  @Input() get selectedProductHeader(): any[]
  {
    // remove @Input() from function signature
    return this._selectedProductHeader;
  }

  set selectedProductHeader(val: any[])
  {
    // restore original order
    this._selectedProductHeader = this.productsHeader
      .filter(col => val.includes(col));
  }
}
