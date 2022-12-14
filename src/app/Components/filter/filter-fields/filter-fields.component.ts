import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-filter-fields',
  templateUrl: './filter-fields.component.html',
  styleUrls: ['../../../../styles/button.css', './filter-fields.component.css']
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
    // if the filter is a date, we need to set the first and last second of the day
    this.filters.forEach((filter: any) =>
    {
      if (filter.type == 'date' && filter.value != null)
      {
        /*filter.value.setHours(0, 0, 0, 0);
        filter.value = filter.value.getTime();*/
        console.log(filter.value);
        const range = filter.value;
        if (range[1] == null)
          range[1] = new Date(range[0]);

        range[0].setHours(0, 0, 0, 0);
        range[1].setHours(23, 59, 59, 999);

        console.log(filter.value)

      }
    });

    this.applyFiltersEvent.emit();
  }

}
