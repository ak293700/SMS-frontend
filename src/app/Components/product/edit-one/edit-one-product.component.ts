import {Component} from '@angular/core';

@Component({
  selector: 'app-edit-one-product',
  templateUrl: './edit-one-product.component.html',
  styleUrls: ['./edit-one-product.component.css']
})
export class EditOneProductComponent
{
  otherProducts: { id: number, productReference: string }[] = [
    {id: 1, productReference: "67001"},
    {id: 2, productReference: "67001D"},
  ];

}
