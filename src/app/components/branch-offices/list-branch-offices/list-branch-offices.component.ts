import { Component, OnInit, inject } from '@angular/core';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { ToastrService } from 'ngx-toastr';
import { IAction } from '../../../models/action.interface';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { IBranchOffices } from '../../../models/branch-offices.interface';
import { BranchOfficesService } from '../../../services/branch-offices/branch-offices.service';
import { IDynamicDataResponse } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-list-branch-offices',
  standalone: true,
  imports: [DynamicTableComponent, MatCardModule, RouterLink, MatButtonModule],
  templateUrl: './list-branch-offices.component.html',
  styleUrl: './list-branch-offices.component.scss'
})
export class ListBranchOfficesComponent implements OnInit{
  private toast = inject(ToastrService);
  private routerlink = inject(Router);
  private branchOfficesService = inject(BranchOfficesService)


  listBranchOffices: IBranchOffices[] = [];
  branchOfficesTableData: any;
  session: any;

  // items of filter
  sortColumn: any;
  filterApplied: any;
  pageNumber = 0;
  pageSize = 10;
  tableUser: any;

  constructor() {
    this.branchOfficesTableData = {
      table_filters: [],
      table_headers: [
        {
          propertyName: 'name',
          nameToShow: 'Nombre',
          sort: 'asc',
          inputType: 'text',
        },
        {
          propertyName: 'description',
          nameToShow: 'Descripción',
          sort: 'asc',
          inputType: 'text',
        },
        { propertyName: 'actions', nameToShow: 'Acciones', sort: null },
      ],
      table_body: [],
      pageSize: 10,
      totalData: 10,
      numOfPages: 1,
      currentPage: 1,
    };
  }
  async ngOnInit() {
    this.filterTable({ fieldToSearch: '' });
  }

  filterTable(toSearch: any) {
    toSearch.columns = Object.assign([], this.branchOfficesTableData.table_headers);
    toSearch.columns.splice(2, 1);
    this.branchOfficesService
      .filter(toSearch)
      .then((response: IDynamicDataResponse<IBranchOffices>) => {
        const list: any[] = [];
        response.data.forEach((data) => {
          list.push({
            name:data.name,
            description: data.description,
            id: data._id,
            inputEditable: false,
            actions: [
              { show: true, action: 'edit', icon: 'fas fa-edit' },
              { show: true, action: 'delete', icon: 'fa-times' },
            ],
          });
        });
        this.branchOfficesTableData.table_body = list;
        this.branchOfficesTableData.totalData = list.length;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('error filter services', 'Error');
      });
  }

  actionHandler(action: IAction) {
    switch (action.action) {
      case 'edit':
        this.routerlink.navigate([`/admin/branch-offices/update/${action.idItem}`]);
        break;
      case 'delete':
        this.branchOfficesService
          .delete(action.idItem)
          .then((response) => {
            this.toast.warning('Sucursal Eliminado', 'Advertencia');
            this.filterTable({});
          })
          .catch((error) => {
            this.toast.error('Ha ocurrido un error', 'error');
          });
        break;
    }
  }

  sortData($event: Event) {}

  pageChanger($event: Event) {}
}
