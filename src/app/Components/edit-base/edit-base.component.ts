import {Component} from '@angular/core';

@Component({
  selector: 'app-edit-base',
  templateUrl: './edit-base.component.html',
  styleUrls: ['./edit-base.component.css']
})
export class EditBaseComponent
{
  /*@Input() otherDatas: IdNameDto[] = [];
  @Input() data: { id: number } = {id: 0};

  @Input('parent') parentComponent: any = undefined;

  @Output('newSelection') newSelectionEvent = new EventEmitter<number>();

  @Output('reset') resetEvent = new EventEmitter();
  @Output('save') saveEvent = new EventEmitter();

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {
  }

  async goToData(id: number)
  {
    const changes = this.parentComponent.detectChanges();
    if (changes.count > 0)
    {
      const message = changes.count == 1
        ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
        : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

      // ConfirmationServiceTools.new(this.confirmationService, this, this.reset, message, id);
      ConfirmationServiceTools.newComplexFunction(this.confirmationService, (instance: any, id: number) => {
        instance.reset();
        instance.newSelectionEvent.emit(id);
      }, message, this, id);
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
    const changes = this.parentComponent.detectChanges();
    if (changes.count == 0)
      return this.resetEvent.emit();

    const message = changes.count == 1
      ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
      : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

    ConfirmationServiceTools.newComplexFunction(this.confirmationService, (instance: any) => {
      instance.resetEvent.emit()
    }, message, this);
  }

  save()
  {
    this.saveEvent.emit();
  }

*/
}
