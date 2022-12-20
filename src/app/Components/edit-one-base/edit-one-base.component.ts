import {Component, Input} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {EditBaseComponent} from "../edit-base/edit-base.component";
import {ConfirmationServiceTools} from "../../../utils/ConfirmationServiceTools";
import {IChanges} from "../../../Interfaces/IChanges";

/*@Component({
  selector: 'app-edit-one-base',
  templateUrl: './edit-one-base.component.html',
  styleUrls: ['./edit-one-base.component.css']
})*/

@Component({
  selector: 'app-edit-one-base',
  templateUrl: '../edit-base/edit-base.component.html',
  styleUrls: ['../edit-base/edit-base.component.css']
})
export class EditOneBaseComponent extends EditBaseComponent
{
  @Input() detectChanges: () => IChanges = () => {return {count: 0, diffObj: []};};

  constructor(messageService: MessageService,
              confirmationService: ConfirmationService)
  {
    super(messageService, confirmationService);
  }

  override async goToData(id: number)
  {
    const changes = this.detectChanges();
    if (changes.count > 0)
    {
      const message = changes.count == 1
        ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
        : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

      const f = (id: number) => {
        this.reset();
        this.newSelectionEvent.emit(id);
      };
      ConfirmationServiceTools.newComplexFunction(this.confirmationService, message, f.bind(this), id);
    }
    else
      this.newSelectionEvent.emit(id);
  }

  reset()
  {
    const changes = this.detectChanges();
    if (changes.count == 0)
      return this.resetEvent.emit();

    const message = changes.count == 1
      ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
      : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

    const f = () => this.resetEvent.emit();
    ConfirmationServiceTools.newComplexFunction(this.confirmationService, message, f.bind(this));
  }
}
