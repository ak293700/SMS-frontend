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
  ];

  selectedProductHeader = this.productsHeader;

  readonly productsData = [
    {
      photo: 'https://cdn3.elecproshop.com/36742-medium_default/interrupteur-commande-vmc-vitesse-1-vitesse-2.jpg',
      productReference: "67001",
      name: "Interrupteur Commande VMC - 2 Vitesse Céliane",
    }
  ];

  @Input() get selectedColumns(): any[]
  {
    return this.selectedProductHeader;
  }

  set selectedColumns(val: any[])
  {
    //restore original order
    this.selectedProductHeader = this.selectedColumns.filter(col => val.includes(col));
  }
}
