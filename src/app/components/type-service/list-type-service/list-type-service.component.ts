import { Component, OnInit, inject } from '@angular/core';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ToastrService } from 'ngx-toastr';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ITypeService } from '../../../models/typeservice.interface';
import { IAction } from '../../../models/action.interface';
import { IDynamicDataResponse } from '../../../models/dynamic.table.interface';
@Component({
  selector: 'app-list-type-service',
  standalone: true,
  imports: [DynamicTableComponent, MatCardModule, RouterLink, MatButtonModule],
  templateUrl: './list-type-service.component.html',
  styleUrl: './list-type-service.component.scss',
})
export class ListTypeServiceComponent implements OnInit {
  private typeServiceService = inject(TypeServiceService);
  private toast = inject(ToastrService);
  private routerlink =inject(Router)
  typeServiceTableData: any;
  busHeadquarterData: any;
  session: any;

  // items of filter
  sortColumn: any;
  filterApplied: any;
  pageNumber = 0;
  pageSize = 10;
  tableUser: any;
  constructor() {
    this.typeServiceTableData = {
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
          nameToShow: 'descripción',
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
  ngOnInit() {
    this.filterTable({ fieldToSearch: '' });
  }

  sortData($event: Event) {}

  filterTable(toSearch: any) {
    toSearch.columns = Object.assign(
      [],
      this.typeServiceTableData.table_headers
    );
    toSearch.columns.splice(this.typeServiceTableData.table_headers - 1, 1);
    this.typeServiceService
      .filter(toSearch)
      .then((responseList: IDynamicDataResponse<ITypeService>) => {
        const listTypeServiceTemp: any[] = [];
        responseList?.data.forEach((typeService) => {
          listTypeServiceTemp.push({
            name: typeService.name,
            description: typeService.description,
            id:typeService._id,
            inputEditable: false,
            actions: [
              { show: true, action: 'edit', icon: 'fas fa-edit' },
              { show: true, action: 'delete', icon: 'fa-times' },
            ],
          });
        });

        this.typeServiceTableData.table_body = listTypeServiceTemp;
        this.typeServiceTableData.totalData = listTypeServiceTemp.length
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error list Type Service', 'Error');
      });
  }
  pageChanger($event: Event) {}

  actionHandler(action: IAction) {
    switch(action.action){
      case 'edit':
        this.routerlink.navigate([`/admin/type-service/update/${action.idItem}`])
        break;
      case 'delete':
        this.typeServiceService.delete(action.idItem).then((response)=>{
          this.toast.warning("Tipo de servicio Eliminado", "Operación Exitosa")
          this.filterTable({ fieldToSearch: '' })
        }).catch((error)=>{
          this.toast.error("Error Eliminar Tipo De Servicio", "Error")
        })
        break;  
    }
  }
}
