import {Component, Input} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {EditBaseComponent} from "../edit-base/edit-base.component";
import {ConfirmationServiceTools} from "../../../../utils/ConfirmationServiceTools";
import {IChanges} from "../../../../Interfaces/IChanges";
import {Sandbox} from "../../../../utils/Sandbox";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit-one-base',
  templateUrl: '../edit-base/edit-base.component.html',
  styleUrls: ['../edit-base/edit-base.component.css']
})
export class EditOneBaseComponent extends EditBaseComponent
{
  @Input() detectChanges: () => IChanges = () => { return {diffObj: [], count: 0}; };

  constructor(messageService: MessageService,
              confirmationService: ConfirmationService,
              router: Router,
              route: ActivatedRoute)
  {
    super(messageService, confirmationService, router, route);
  }

  override async goToData(id: number)
  {
    const changes = this.detectChanges();
    if (changes.count > 0)
    {
      const f = (id: number) => {
        this.reset();
        this.newSelectionEvent.emit(id);
      };
      ConfirmationServiceTools.newComplexFunction(this.confirmationService,
          Sandbox.buildCancelChangeMessage(changes.count),
          f.bind(this), id);
    }
    else
      this.newSelectionEvent.emit(id);
  }

  override reset()
  {
    const changes = this.detectChanges();

    if (changes.count == 0)
    {

      return this.messageService.add({
        severity: 'info',
        summary: 'Aucun changement',
        detail: 'Aucun changement à abandonner'
      });
    }

    const f = () => this.resetEvent.emit();
    ConfirmationServiceTools.newComplexFunction(this.confirmationService,
        Sandbox.buildCancelChangeMessage(changes.count),
        f.bind(this));
  }
}
