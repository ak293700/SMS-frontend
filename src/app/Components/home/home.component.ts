import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  public readonly sections = [
    {
      label: 'Produits',
      link: '/product/filter'
    },
    {
      label: 'Remises',
      link: '/discount'
    },
    {
      label: 'Paramètres',
      link: '/settings'
    }
  ];
}
