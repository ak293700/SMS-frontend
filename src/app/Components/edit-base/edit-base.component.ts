import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {ConfirmationService, MessageService} from "primeng/api";
import {Operation} from "../../../utils/Operation";
import {IChanges} from "../../../Interfaces/IChanges";
import {ConfirmationServiceTools} from "../../../utils/ConfirmationServiceTools";

@Component({
  selector: 'app-edit-base',
  templateUrl: './edit-base.component.html',
  styleUrls: ['./edit-base.component.css']
})
export class EditBaseComponent
{
  @Input() otherDatas: IdNameDto[] = [];
  @Input() data: { id: number } = {id: 0};

  @Input() detectChanges: () => IChanges = () => {return {count: 0, diffObj: []};};

  @Output('newSelection') newSelectionEvent = new EventEmitter<number>();

  @Output('reset') resetEvent = new EventEmitter();
  @Output('save') saveEvent = new EventEmitter();

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {
  }

  async goToData(id: number)
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

  async goToFollowingData(step: number)
  {
    let index = this.otherDatas.findIndex(x => x.id == this.data.id);
    if (index == -1)
    {
      this.messageService.add({
        severity: 'warn', summary: 'Oups une erreur est survenue',
        detail: 'impossible de naviguer au prochain produit'
      });
      return;
    }

    index = Operation.modulo(index + step, this.otherDatas.length);
    await this.goToData(this.otherDatas[index].id);
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

  save()
  {
    this.saveEvent.emit();
  }
}
