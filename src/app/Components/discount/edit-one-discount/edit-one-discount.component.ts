import {Component, OnInit} from '@angular/core';
import {Operation} from "../../../../utils/Operation";
import {ConfirmationService, MessageService} from "primeng/api";
import {IdNameDto} from "../../../../Dtos/IdNameDto";

@Component({
  selector: 'app-edit-one-discount',
  templateUrl: './edit-one-discount.component.html',
  styleUrls: ['./edit-one-discount.component.css', '../../../../styles/button.css']
})
export class EditOneDiscountComponent implements OnInit
{
  otherDiscounts: IdNameDto[] = [];

  discount: any = {};

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService)
  {}

  async ngOnInit(): Promise<void>
  {
    let routedData: { selectedIds: number[], selectedId: number } = history.state;
    if (routedData.selectedIds == undefined)
      routedData.selectedIds = [247];

    if (routedData.selectedId == undefined)
      routedData.selectedId = Operation.firstOrDefault(routedData.selectedIds) ?? 0;

    // push at the beginning of the array
    if (!routedData.selectedIds.includes(routedData.selectedId))
      routedData.selectedIds.unshift(routedData.selectedId);
  }

  async goToDiscount(id: number)
  {
    /*const changes = this.detectChanges();
    if (changes.count > 0)
    {
      const message = changes.count == 1
        ? `Vous avez ${changes.count} changement non sauvegardé. Voulez-vous vraiment l'abandonner ?`
        : `Vous avez ${changes.count} changements non sauvegardés. Voulez-vous vraiment les abandonner ?`

      ConfirmationServiceTools.new(this.confirmationService, this, this.fetchProduct, message, id);
    }
    else*/
    await this.fetchDiscount(id);
  }

  async goToFollowingToDiscount(step: number)
  {
    let index = this.otherDiscounts.findIndex(x => x.id == this.discount.id);
    if (index == -1)
    {
      this.messageService.add({
        severity: 'warn', summary: 'Oups une erreur est survenue',
        detail: 'impossible de naviguer au prochain produit'
      });
      return;
    }

    index = Operation.modulo(index + step, this.otherDiscounts.length);
    await this.goToDiscount(this.otherDiscounts[index].id);
  }

  async fetchDiscount(id: number)
  {

  }

}
