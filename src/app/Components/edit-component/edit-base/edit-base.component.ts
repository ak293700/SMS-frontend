import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {ConfirmationService, MessageService} from "primeng/api";
import {Operation} from "../../../../utils/Operation";

/*@Component({
  selector: 'app-edit-base',
  templateUrl: './edit-base.component.html',
  styleUrls: ['./edit-base.component.css']
})*/
@Component({template: '',}) // being abstract it has no selector, no style and no template
export abstract class EditBaseComponent
{
  @Input() otherDatas: IdNameDto[] = [];
  @Input() data: { id: number } = {id: 0};

  @Output('newSelection') newSelectionEvent = new EventEmitter<number>();

  @Output('reset') resetEvent = new EventEmitter();
  @Output('save') saveEvent = new EventEmitter();

  protected constructor(protected messageService: MessageService,
                        protected confirmationService: ConfirmationService)
  {
  }

  abstract goToData(id: number): void;

  async goToFollowingData(step: number)
  {
    let index = this.otherDatas.findIndex(x => x.id == this.data.id);
    if (index == -1)
    {
      this.messageService.add({
        severity: 'warn', summary: 'Oups une erreur est survenue',
        detail: "Impossible de naviguer jusqu'à l'élément sélectionné"
      });
      return;
    }

    index = Operation.modulo(index + step, this.otherDatas.length);
    await this.goToData(this.otherDatas[index].id);
  }

  abstract reset(): void

  save()
  {
    this.saveEvent.emit();
  }
}
