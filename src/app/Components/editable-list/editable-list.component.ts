import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IdNameDto} from "../../../Dtos/IdNameDto";
import {MenuItem} from "primeng/api";

export interface IListItem
{
  id: number;
  label: string;
  additionalFields?: any; // map of key=label, value=value
}


@Component({
  selector: 'app-editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.css', '../../../styles/button.css']
})
export class EditableListComponent implements OnInit
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

  constructor()
  {}

  ngOnInit(): void
  {
    if (this.additionalFields.length > 0)
      this.menuItems.push({label: 'Edit', icon: 'pi pi-pencil', command: (event) => this.editItem(event)});
    this.menuItems.push({label: 'Delete', icon: 'pi pi-trash', command: (event) => this.deleteItem(event)});

    this.items.forEach((item: IListItem) =>
    {
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

    this.items.push({id: event.id, label: event.name});
  }


  deleteItem(event: any)
  {
    const index = this.items.findIndex((item: IListItem) => item.id == event.id);
    this.items.splice(index, 1);
  }

  editItem(event: any)
  {
    console.log('editItem', event);
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
}
