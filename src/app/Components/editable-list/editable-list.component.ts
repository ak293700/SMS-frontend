import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {MenuItem} from "primeng/api";
import {IEnumerableByString} from "../../../Interfaces/IEnumerableByString";
import {Operation} from "../../../utils/Operation";

export interface IListItem extends IEnumerableByString
{
  uniqueId?: number;
  id: number;
  label: string;
  additionalFields?: any; // map of key=label, value=value
}


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

  @Output('items') itemsEvent = new EventEmitter<IListItem[]>();
  @Input() additionalFields: { label: string, type: string, default?: any }[] = [];

  @Input() unique: boolean = true;

  menuItems: MenuItem[] = [];

  isDialogVisible: boolean = false;

  // @ts-ignore

  currentItem: IListItem;
  private uniqueId: number = 0;

  constructor()
  {}

  ngOnInit(): void
  {
    if (this.additionalFields.length > 0)
      this.menuItems.push({label: 'Éditer', icon: 'pi pi-pencil', command: (event) => this.editItem(event)});
    this.menuItems.push({label: 'Supprimer', icon: 'pi pi-trash', command: (event) => this.deleteItem(event)});

    // if the additional fields are not initialized, we initialize them

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
        if (item.additionalFields[field.label] == null)
          item.additionalFields[field.label] = field.default;
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

    const newItem: IListItem = {id: event.id, label: event.name};
    if (this.additionalFields.length > 0)
    {
      newItem.additionalFields = {};
      this.additionalFields.forEach((field: any) => newItem.additionalFields[field.label] = (field.default ?? null));
    }

    this.items.push({uniqueId: this.uniqueId++, id: event.id, label: event.name});
  }

  deleteItem(event: any)
  {
    const index = this.items.findIndex((item: IListItem) => item.uniqueId == this.currentItem.uniqueId);
    this.items.splice(index, 1);
  }

  editItem(event: any)
  {
    console.log('event', event);
    const eventItem = event.item;
    console.log('eventItem', eventItem);

    // this.currentItem =
    //   Operation.first(this.items, (item: IListItem) => item.uniqueId == eventItem.uniqueId);

    console.log()

    this.isDialogVisible = true;
  }

  getTooltip(item: IListItem)
  {
    if (this.additionalFields.length == 0)
      return '';

    let tooltip = '';
    for (let field of this.additionalFields)
    {

      tooltip += field.label + ': ' + item.additionalFields[field.label];
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
