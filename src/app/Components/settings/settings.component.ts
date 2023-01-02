import {Component} from '@angular/core';
import {AuthGuard} from "../../Guards/auth.guard";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [
    '../../../styles/button.css',
    '../../../styles/main-color-background.css',
    './settings.component.css'
  ]
})
export class SettingsComponent
{
  constructor(private authGuard: AuthGuard,
              private router: Router)
  {}

  async logOut()
  {
    this.authGuard.reset();
    await this.router.navigate(['/login']);
  }
}
