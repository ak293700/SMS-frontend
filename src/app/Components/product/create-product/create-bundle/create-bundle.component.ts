import {Component} from '@angular/core';
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-bundle',
  templateUrl: './create-bundle.component.html',
  styleUrls: [
    '../../../../../styles/main-color-background.css',
    '../../../../../styles/button.css',
    './create-bundle.component.css'
  ]
})
export class CreateBundleComponent
{

  steps: MenuItem[];
  pageIndex: number = 0;

  constructor(private route: Router)
  {
    this.steps = [
      {label: 'Composant', routerLink: './composant'},
      {label: 'Autre attribut', routerLink: '/product/filter'},
    ];
  }

  async previousPage()
  {
    await this.goToPage(this.pageIndex + 1);
  }

  async nextPage()
  {
    await this.goToPage(this.pageIndex + 1);
  }

  async goToPage(pageIndex: number)
  {
    this.pageIndex = pageIndex;
    await this.route.navigate([this.steps[pageIndex]]);
  }
}
