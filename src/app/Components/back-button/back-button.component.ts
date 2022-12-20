import {Component, Input} from '@angular/core';
import {Router, UrlTree} from "@angular/router";

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: [
    '../../../styles/button.css',
    './back-button.component.css'
  ]
})
export class BackButtonComponent
{
  @Input() routerLink: string | undefined = undefined;

  _routerLink: string;

  constructor(private router: Router)
  {
    if (this.routerLink !== undefined)
    {
      this._routerLink = this.routerLink;
      return;
    }

    // get the last route
    const tmp: UrlTree | undefined = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl;
    if (tmp === undefined)
    {
      this._routerLink = '..';
      return;
    }

    this._routerLink = tmp.toString();
  }
}
