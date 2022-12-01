import {Component} from '@angular/core';

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
  public readonly productsHeader = [
    /*    {
          label: 'Photo',
          field: 'image',
        },*/
    {
      label: 'Reference produit',
      field: 'productReference',

    },
  ];

  public readonly productsData = [
    {
      image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      productReference: "productReference",
    }
  ];
}
