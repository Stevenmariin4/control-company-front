import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicFilterComponent } from '../dynamic-filter/dynamic-filter.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    MatTooltipModule,
    MatSelectModule,
    FormsModule,
    MatPaginatorModule,
    DynamicFilterComponent,
    MatButtonModule
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent implements OnInit {
  @Input() tableStructure:
    | { totalData: number; pageSize: number; changed: any }
    | any;
  @Input() pageIndex: any;
  @Output() tableAction: EventEmitter<any>;
  @Output() tableChangePage: EventEmitter<any>;
  @Output() filter: EventEmitter<any>;
  @Output() sort: EventEmitter<any>;
  @ViewChild('paginator') paginator: MatPaginator | any;
  pages: Array<number>;
  searchField: string | null | undefined;
  currentPage: number;
  countPages: number = 0;
  pageEvent: PageEvent | undefined;

  private _sanitizer = inject(DomSanitizer);

  constructor() {
    this.tableAction = new EventEmitter<any>();
    this.tableChangePage = new EventEmitter<any>();
    this.filter = new EventEmitter<any>();
    this.sort = new EventEmitter<any>();
    this.pages = [];
    this.currentPage = 1;
  }

  ngOnInit() {
    this.countPages = Math.ceil(
      this.tableStructure.totalData / this.tableStructure.pageSize
    );
    if (this.tableStructure.changed) {
      this.paginator.firstPage();
    }
    this.getNumOfPages(this.countPages);
  }

  /**
   * This use the sort property of column to sort the table data through the emitter,
   * the father component must realize the request to get the sorted data
   * @param {*} field this param contains the property 'sort'
   * @memberof DynamicTablesComponent
   */
  sortBy(field: any) {
    if (field.sort == 'asc') {
      field.sort = 'desc';
      this.sort.emit(field);
    } else if (field.sort == 'desc') {
      field.sort = 'asc';
      this.sort.emit(field);
    }
  }

  /**
   * This gets the total pages from the table object and generate the pagination,
   * which use the pages array to render the pagination in the view
   * @param {*} totalPages
   * @memberof DynamicTablesComponent
   */
  getNumOfPages(totalPages: any) {
    this.pages = [];
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
    }
  }

  /**
   * This take the search string and send this to the father component to realize the search
   *
   * @param {*} searchField
   * @memberof DynamicTablesComponent
   */
  searchBy(searchField: any) {
    if (searchField != undefined || searchField != '') {
      this.filter.emit(searchField);
      this.searchField = null;
    }
  }

  /**
   * This take the current page and send it to the father component the previous page to consult,
   * this must be realized through a service in the father component
   * @param {*} page
   * @memberof DynamicTablesComponent
   */
  previousPage(page: any) {
    console.log(page);
    page = page < 1 ? 1 : page - 1;
    if (page >= 1) {
      this.currentPage = this.currentPage - 1;
      const pageAction = {
        action: 'prevPage',
        page,
      };
      this.tableChangePage.emit(pageAction);
    } else {
      console.log('menos de 1');
    }
  }

  /**
   * This take the current page and send it to the father component the next page to consult,
   * this must be realized through a service in the father component
   * @param {*} page
   * @memberof DynamicTablesComponent
   */
  nextPage(page: any) {
    console.log(page);
    console.log(this.countPages);
    page = page > this.countPages ? this.countPages : page + 1;
    if (page <= this.countPages) {
      this.currentPage = this.currentPage + 1;
      const pageAction = {
        action: 'nextPage',
        page,
      };
      this.tableChangePage.emit(pageAction);
    } else {
      console.log('más de ' + this.currentPage);
    }
  }

  /**
   * This take the selected page and send it to the father component to consult,
   * this must be realized through a service in the father component
   * @param {*} page
   * @memberof DynamicTablesComponent
   */
  goToPage(page: any) {
    const pageAction = {
      action: 'goToPage',
      page: page.pageIndex,
      pageSize: page.pageSize,
    };
    this.tableChangePage.emit(pageAction);
  }

  /**
   * This method sends to the father component the action selected in the table,
   * those actions are handled by the father component
   * @param {*} actionToLaunch
   * @param {*} id
   * @param input
   * @memberof DynamicTablesComponent
   */
  action(actionToLaunch: string, id: any, input = {}) {
    if (actionToLaunch !== 'editInLine' && actionToLaunch !== 'discardInLine') {
      const action = {
        idItem: id,
        action: actionToLaunch,
        allData: input,
      };
      this.tableAction.emit(action);
    } else {
      this.switchEditable(input);
    }
  }

  /**
   * This method returns the type of the data
   * @param data
   */
  validate(data: any) {
    return typeof data;
  }

  /**
   * This method returns the secure url from a image, can be applied for a external url
   * @param url
   */
  validateImage(url: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /**
   * This method realize the change to edit the selected row
   * @param field
   */
  switchEditable(field: { inputEditable?: any; name?: any }) {
    if (field.inputEditable) {
      console.log(field.name, field.inputEditable);
      field.inputEditable = false;
    } else {
      console.log(field.name, field.inputEditable);
      field.inputEditable = true;
    }
    return field;
  }

  /**
   * This method returns the item selected and change the status of the list to false, which hide the list in the view
   * @param selection
   * @param item
   */
  optionSelected(
    selection: { value: any },
    item: { value: any; hide: boolean }
  ) {
    item.value = selection.value;
    item.hide = false;
    console.log('selection: ', selection);
    console.log('item: ', item);
    return item;
  }

  /**
   * This method compare the current selection made by the user,
   * add the selection to the list and change the status in the radio option
   * @param item
   * @param selection
   * @param options
   */
  selectRadio(item: { value: any }, selection: any, options: any[]) {
    options.find((option: { value: any; selected: boolean }) => {
      if (option.value === selection) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    item.value = selection;
  }

  /**
   * This method compare if the current selection exists in the list and remove from it,
   * if not exist this method add the selection made by user to the current list
   * @param item
   * @param selection
   */
  selectCheckbox(item: { value: any[] | undefined }, selection: any) {
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
}
