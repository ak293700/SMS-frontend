import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-filter-fields',
  templateUrl: './filter-fields.component.html',
  styleUrls: [
    '../../../../styles/button.css',
    './filter-fields.component.css'
  ]
})
export class FilterFieldsComponent
{
  @Input() filters: any[] = [];
  @Output('applyFilters') applyFiltersEvent = new EventEmitter();

  dropDownFilter(event: any, filter: any)
  {
    // Todo does not works
    filter.others =
      filter.others.filter((other: any) => other.toLowerCase().includes(event.query.toLowerCase()));
  }

  async applyFilters()
  {
    this.applyFiltersEvent.emit();
  }

}
