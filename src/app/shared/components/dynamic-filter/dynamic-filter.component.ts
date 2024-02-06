import { AsyncPipe, NgClass, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dynamic-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    MatFormFieldModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
    AsyncPipe,
    MatButtonModule
  ],
  templateUrl: './dynamic-filter.component.html',
  styleUrl: './dynamic-filter.component.scss',
})
export class DynamicFilterComponent implements OnInit{
  searchField: string | undefined;
  @Input() table_filters: any;
  @Output() filter: EventEmitter<any>;
  searchShow: boolean | undefined;
  constructor() {
    this.filter = new EventEmitter<any>();
  }

  ngOnInit() {
    this.searchShow = true;
  }

  /**
   * This take the search string and send this to the father component to realize the search
   *
   * @param {*} searchField
   * @memberof DynamicTablesComponent
   */
  searchBy(searchField: string | undefined) {
    if (searchField != undefined || searchField != '') {
      this.filter.emit({ fieldToSearch: searchField });
      // this.searchField = null;
    }
  }

  /**
   * This method compare if the current selection exists in the list and remove from it,
   * if not exist this method add the selection made by user to the current list
   * @param item
   * @param selection
   */
  selectCheckbox(item: { value: any[] | undefined; }, selection: any) {
    if (item.value != undefined) {
      if (item.value.length > 0) {
        const found = item.value.indexOf(selection);
        if (found != -1) {
          item.value.splice(found, 1);
        } else {
          item.value.push(selection);
        }
      } else {
        item.value.push(selection);
      }
    } else {
      item.value = [];
      item.value.push(selection);
    }
  }

  /**
   * This method compare the current selection made by the user,
   * add the selection to the list and change the status in the radio button option
   * @param item
   * @param selection
   * @param options
   */
  selectRadio(item: { value: any; }, selection: any, options: any[]) {
    options.find((option: { value: any; selected: boolean; }) => {
      if (option.value === selection) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    item.value = selection;
  }

  /**
   * This method returns the item selected and change the status of the list to false, which hide the list in the view
   * @param selection
   * @param item
   */
  optionSelected(selection: { value: any; }, item: { value: any; hide: boolean; }) {
    item.value = selection.value;
    item.hide = false;
    console.log('selection: ', selection);
    console.log('item: ', item);
    return item;
  }

  async sendAdvancedSearch(fields: any[]) {
    const filtersUsed: any[] = [];
    fields.forEach(
      await function(filterUsed: { value: undefined; }) {
        if (filterUsed.value !== undefined) {
          filtersUsed.push(filterUsed);
        }
      }
    );
    this.filter.emit({ fieldToSearch: filtersUsed });
  }

  displayFn(option: any) {
    return option ? option.value : undefined;
  }

  showSearch() {
    this.searchShow = !this.searchShow;
  }
}
