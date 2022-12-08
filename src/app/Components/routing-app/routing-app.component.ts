import {Component} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './routing-app.component.html',
  styleUrls: ['./routing-app.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class RoutingAppComponent
{
  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {}
}
