import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IdNameDto} from "../../../../Dtos/IdNameDto";
import {MenuItem} from "primeng/api";
import {IEnumerableByString} from "../../../../Interfaces/IEnumerableByString";
import {Operation} from "../../../../utils/Operation";

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
  styleUrls: [
    './editable-list.component.css',
    '../../../../styles/button.css'
  ]
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

  @Input() selectable: boolean = false;

  @Input() selectedItem: IListItem | undefined = undefined;
  @Output() selectedItemChange: EventEmitter<IListItem> = new EventEmitter<IListItem>();
  _selectedItem: ICompleteListItem | undefined = undefined;

  // the name of the property to display in the bubble in the upper right corner
  @Input() padProperty: string | undefined = undefined;

  @Input() disabled = false;

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

    this.menuItems.push({label: 'Supprimer', icon: 'pi pi-trash', command: this.deleteItem.bind(this)});

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
    this._items = this.items.map((item: IListItem): ICompleteListItem =>
    {
      const _item: ICompleteListItem = Operation.deepCopy<any>(item);

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

    if (!this.selectable)
      this._selectedItem = undefined;
    else
    {
      this._selectedItem = Operation.firstOrDefault(this._items, item => item.id === this.selectedItem?.id);
    }
  }

  initPadProperty()
  {
    if (this.padProperty == undefined)
      return;
  }

  completeMethod(event: any)
  {
    this.suggestions = Operation.completeMethod(event.query, this.initialSuggestions);
  }

  // call when adding a new item to the list
  onAdd(event: any)
  {
    if (this.unique && this._items.find((item: ICompleteListItem) => item.id == event.id) != null)
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
    const index = this._items.findIndex((item: ICompleteListItem) => item.uniqueId === this.currentItem.uniqueId);
    this._items.splice(index, 1);

    if (this._selectedItem != undefined && this._selectedItem.uniqueId === this.currentItem.uniqueId)
    {
      this._selectedItem = undefined;
      this.emitSelectedItemsChange();
    }

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


  // call when selecting an item from the list
  onSelect(item: ICompleteListItem)
  {
    if (!this.selectable)
      return;

    // If the item is already selected, we unselect it
    if (this._selectedItem == item)
      this._selectedItem = undefined;
    else
      this._selectedItem = item;

    this.emitSelectedItemsChange();
  }

  emitSelectedItemsChange()
  {
    const tmp: any = Operation.deepCopy(this._selectedItem);
    if (tmp != undefined)
    {
      delete tmp.uniqueId;
      delete tmp.tooltip;
    }
    this.selectedItemChange.emit(tmp);
  }
}
