import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {MenuItem} from "primeng/api";
import {IEnumerableByString} from "../../../Interfaces/IEnumerableByString";
import {Operation} from "../../../utils/Operation";

export interface IListItem extends IEnumerableByString
{
  id: number;
  label: string; // label display on the item
  additionalFields?: any; // map of key=label, value=value
}


interface ICompleteListItem extends IListItem
{
  uniqueId: number;
  tooltip: string;
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
  @Output() itemsChange: EventEmitter<IListItem[]> = new EventEmitter<IListItem[]>();

  // We use another object to store the items, because we need to add some properties to the items
  _items: ICompleteListItem[] = [];

  @Input() additionalFields: { fieldName: string, label: string, type: string, default?: any }[] = [];

  @Input() unique: boolean = true;

  menuItems: MenuItem[] = [];

  isDialogVisible: boolean = false;

  // @ts-ignore

  currentItem: ICompleteListItem;
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

    this.initItem();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    this.initItem();
  }

  initItem()
  {
    this.uniqueId = 0;

    // initialize _items from items
    this._items = this.items.map((item: IListItem): ICompleteListItem =>
    {
      const _item: ICompleteListItem = Operation.deepCopy(item);

      if (_item.additionalFields == null)
        _item.additionalFields = {};
      this.additionalFields.forEach((field: any) =>
      {
        if (_item.additionalFields[field.fieldName] == null)
          _item.additionalFields[field.fieldName] = field.default;
      });

      _item.uniqueId = this.uniqueId++;
      _item.tooltip = this.getTooltip(_item);
      return _item;
    });
  }

  completeMethod(event: any)
  {
    this.suggestions = this.initialSuggestions
      .filter((obj: any) => obj.name.toLowerCase().includes(event.query.toLowerCase()));
  }

  onSelect(event: any)
  {
    if (this.unique && this._items.find((item: IListItem) => item.id == event.id) != null)
      return;

    const newItem: ICompleteListItem = {id: event.id, label: event.name, uniqueId: this.uniqueId++, tooltip: ''};
    if (this.additionalFields.length > 0)
    {
      newItem.additionalFields = {};
      this.additionalFields.forEach((field: any) => newItem.additionalFields[field.fieldName] = (field.default ?? null));
    }

    newItem.tooltip = this.getTooltip(newItem);
    this._items.push(newItem);
    this.emitItemsChange();
  }

  deleteItem()
  {
    const index = this._items.findIndex((item: ICompleteListItem) => item.uniqueId == this.currentItem.uniqueId);
    this._items.splice(index, 1);
    this.emitItemsChange();
  }

  editItem()
  {
    this.isDialogVisible = true;
  }

  onCloseEditDialog()
  {
    this.emitItemsChange();
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

  onContextMenu(event: any, item: ICompleteListItem)
  {
    this.currentItem = Operation.first(this._items, (i: ICompleteListItem) => i.uniqueId == item.uniqueId);
  }

  emitItemsChange()
  {
    const items = this._items.map((item: ICompleteListItem): IListItem =>
    {
      const tmp: any = Operation.deepCopy(item);
      delete tmp.uniqueId;
      delete tmp.tooltip;
      return tmp as IListItem;
    });

    this.itemsChange.emit(items);
  }
}
