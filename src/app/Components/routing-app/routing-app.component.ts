import {Component} from '@angular/core';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './routing-app.component.html',
  styleUrls: ['./routing-app.component.css'],
  providers: [MessageService]
})
export class RoutingAppComponent
{
  constructor(private messageService: MessageService) {}
}
