import {Component} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute)
  {
    this.steps = [
      {label: 'Composant', routerLink: 'composant'},
      {label: 'Autre attribut', routerLink: 'other-fields'}
    ];
  }

  async previousPage()
  {
    await this.goToPage(this.pageIndex - 1);
  }

  async nextPage()
  {
    await this.goToPage(this.pageIndex + 1);
  }

  async goToPage(pageIndex: number)
  {

    if (pageIndex < 0)
    {
      await this.router.navigate(['..'], {relativeTo: this.activatedRoute});
    }
    else if (pageIndex >= this.steps.length)
    {
      await this.create();
    }
    else
    {
      this.pageIndex = pageIndex;

      const route = `${this.steps[pageIndex].routerLink}`;
      await this.router.navigate([route], {relativeTo: this.activatedRoute});
    }

  }

  create()
  {
    console.log("Create");
  }
}
