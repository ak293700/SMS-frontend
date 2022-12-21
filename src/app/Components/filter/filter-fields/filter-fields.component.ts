import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Operation} from "../../../../utils/Operation";

@Component({
  selector: 'app-filter-fields',
  templateUrl: './filter-fields.component.html',
  styleUrls: ['../../../../styles/button.css', './filter-fields.component.css']
})
export class FilterFieldsComponent implements OnInit, OnChanges
{
  @Input() filters: any[] = [];
  initialFilters: any[] = [];


  @Output('applyFilters') applyFiltersEvent = new EventEmitter();


  ngOnInit(): void
  {
    this.initialFilters = Operation.deepCopy(this.filters);
  }

  ngOnChanges(): void
  {
    this.initialFilters = Operation.deepCopy(this.filters);
  }

  dropDownFilter(event: any, index: number)
  {
    this.filters[index].others = Operation.completeMethod(event.query, this.initialFilters[index].others);
  }

  async applyFilters()
  {
    // reformat some filters
    this.filters.forEach((filter: any) =>
    {
      // if the filter is a date, we need to set the first and last second of the day
      if (filter.type == 'date' && filter.value != null)
      {
        const range = filter.value;
        if (range[1] == null)
          range[1] = new Date(range[0]);

        range[0].setHours(0, 0, 0, 0);
        range[1].setHours(23, 59, 59, 999);
      }
    });

    this.applyFiltersEvent.emit();
  }
}
