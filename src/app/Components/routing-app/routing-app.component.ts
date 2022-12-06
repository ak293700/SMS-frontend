import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-root',
  templateUrl: './routing-app.component.html',
  styleUrls: ['./routing-app.component.css'],
  providers: [MessageService]
})
export class RoutingAppComponent implements OnInit
{
  constructor(private messageService: MessageService) {}

  ngOnInit(): void
  {
    this.messageService.add({severity: 'success', summary: 'Welcome to the app'});
    console.log('RoutingAppComponent.ngOnInit()');
  }
}
