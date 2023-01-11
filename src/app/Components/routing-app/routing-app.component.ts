import {Component} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './routing-app.component.html',
  styleUrls: ['./routing-app.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class RoutingAppComponent
{
  constructor(private router: Router)
  {
    // this.router.events.subscribe((event) => {
    //     console.log(event);
    // });
  }
}
