import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {Shop} from "../../../../Enums/Shop";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-shop-specific-selector',
  templateUrl: './shop-specific-selector.component.html',
  styleUrls: ['./shop-specific-selector.component.css']
})
export class ShopSpecificSelectorComponent implements OnChanges
{
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  availableShops: IdNameDto[] = [];
  selectedShop: IdNameDto | undefined;

  @Input() forbiddenShops: Shop[] = [];
    @Output('onSelect') selectedShopChange = new EventEmitter<IdNameDto>();

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.hasOwnProperty('forbiddenShops'))
    {
      this.availableShops = Shop.All()
          .filter(shop => !this.forbiddenShops.includes(shop))
          .map(shop => {
            return {
              id: shop,
              name: Shop.toString(shop)
            };
          });
    }

    if (changes.hasOwnProperty('visible'))
    {
      // if the user want to show the dialog we test the integrity
      if (this.visible && this.availableShops.length === 0)
      {
        this.messageService.add({
          severity: 'warn',
          summary: 'Opération impossible',
          detail: 'Tout les shops sont déjà créés'
        });
        this.visible = false;
      }
    }
  }

  private setVisibility(visible: boolean)
  {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  onValidate()
  {
      this.setVisibility(false);
      if (this.selectedShop == undefined)
          return this.messageService.add({
              severity: 'erreur',
              summary: 'Opération impossible',
              detail: 'Aucun shop sélectionné'
          });

      this.selectedShopChange.emit(this.selectedShop);
  }
}
