import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {MenuItem} from "primeng/api";
import {IEnumerableByString} from "../../../Interfaces/IEnumerableByString";
import {Operation} from "../../../utils/Operation";

export interface IListItem extends IEnumerableByString
{
  uniqueId?: number;
  id: number;
  label: string; // label display on the item
  additionalFields?: any; // map of key=label, value=value
}

//
// interface ICompleteListItem extends IListItem
// {
//   uniqueId?: number;
//   id: number;
//   label: string;
//   additionalFields?: any; // map of key=label, value=value
// }


@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.css', '../../../styles/button.css']
})
export class EditableListComponent implements OnInit, OnChanges
{
  @Input('suggestions') initialSuggestions: IdNameDto[] = [];
  suggestions: IdNameDto[] = this.initialSuggestions;
  selectorItem: IdNameDto = {id: 0, name: ''};

  @Input() items: IListItem[] = [];
  @Output('items') itemsEvent: EventEmitter<IListItem[]> = new EventEmitter<IListItem[]>();

  // private _items: ICompleteListItem[] = [];

  @Input() additionalFields: { fieldName: string, label: string, type: string, default?: any }[] = [];

  @Input() unique: boolean = true;

  menuItems: MenuItem[] = [];

  isDialogVisible: boolean = false;

  // @ts-ignore

  currentItem: IListItem;
  private uniqueId: number = 0;

  constructor()
  {
  }

  ngOnInit(): void
  {
    if (this.additionalFields.length > 0)
      this.menuItems.push({label: 'Éditer', icon: 'pi pi-pencil', command: () => this.editItem()});
    this.menuItems.push({label: 'Supprimer', icon: 'pi pi-trash', command: () => this.deleteItem()});

    // if the additional fields are not initialized, we initialize them

    console.log(this.items);
    this.initItem();

  }

  ngOnChanges(changes: SimpleChanges): void
  {
    this.initItem();
  }

  initItem()
  {
    this.uniqueId = 0;
    this.items.forEach((item: IListItem) =>
    {
      item.uniqueId = this.uniqueId++;
      if (item.additionalFields == null)
        item.additionalFields = {};
      this.additionalFields.forEach((field: any) =>
      {
        if (item.additionalFields[field.fieldName] == null)
          item.additionalFields[field.fieldName] = field.default;
      });
    });
  }

  completeMethod(event: any)
  {
    this.suggestions = this.initialSuggestions
      .filter((obj: any) => obj.name.toLowerCase().includes(event.query.toLowerCase()));
  }

  onSelect(event: any)
  {
    if (this.unique && this.items.find((item: IListItem) => item.id == event.id) != null)
      return;

    const newItem: IListItem = {id: event.id, label: event.name, uniqueId: this.uniqueId++};
    if (this.additionalFields.length > 0)
    {
      newItem.additionalFields = {};
      this.additionalFields.forEach((field: any) => newItem.additionalFields[field.fieldName] = (field.default ?? null));
    }

    this.items.push(newItem);

    console.log(this.items);
  }

  deleteItem()
  {
    const index = this.items.findIndex((item: IListItem) => item.uniqueId == this.currentItem.uniqueId);
    this.items.splice(index, 1);
  }

  editItem()
  {
    this.isDialogVisible = true;
  }

  getTooltip(item: IListItem)
  {
    if (this.additionalFields.length == 0)
      return '';

    let tooltip = '';
    for (let field of this.additionalFields)
    {

      tooltip += field.label + ': ' + item.additionalFields[field.fieldName];
    }

    return tooltip;
  }

  onContextMenu(event: any, item: IListItem)
  {
    console.log('onContextMenu');
    this.currentItem = Operation.first(this.items, (i: IListItem) => i.uniqueId == item.uniqueId);
    console.log('this.currentItem', this.currentItem);
  }
}
