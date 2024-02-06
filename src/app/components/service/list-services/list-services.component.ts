import { Component, inject } from '@angular/core';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { ToastrService } from 'ngx-toastr';
import { IAction } from '../../../models/action.interface';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ServicesService } from '../../../services/services/services.service';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ITypeService } from '../../../models/typeservice.interface';
import { IService } from '../../../models/services.interface';
import { LoadingService } from '../../../services/loading/loading.service';
import { IDynamicDataResponse } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-list-services',
  standalone: true,
  imports: [DynamicTableComponent, MatCardModule, RouterLink, MatButtonModule],
  templateUrl: './list-services.component.html',
  styleUrl: './list-services.component.scss',
})
export class ListServicesComponent {
  private serviceService = inject(ServicesService);
  private typeServiceService = inject(TypeServiceService);
  private toast = inject(ToastrService);
  private routerlink = inject(Router);
  private loadingService = inject(LoadingService)

  listTypeService: ITypeService[] = [];
  serviceTableData: any;
  session: any;

  // items of filter
  sortColumn: any;
  filterApplied: any;
  pageNumber = 0;
  pageSize = 10;
  tableUser: any;
  constructor() {
    this.serviceTableData = {
      table_filters: [],
      table_headers: [
        {
          propertyName: 'name',
          nameToShow: 'Nombre',
          sort: 'asc',
          inputType: 'text',
        },
        {
          propertyName: 'typeService',
          nameToShow: 'Tipo de servicio',
          sort: 'asc',
          inputType: 'text',
        },
        {
          propertyName: 'amount',
          nameToShow: 'Monto',
          sort: 'asc',
          inputType: 'number',
        },
        {
          propertyName: 'fee',
          nameToShow: 'Tarifa',
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
    this.loadingService.showLoader();
    await this.getAllTypeServices();
    this.loadingService.hideLoader();
    this.filterTable({ fieldToSearch: '' });
  }

  getAllTypeServices() {
    this.typeServiceService
      .filter({ fieldToSearch: '' })
      .then((response: IDynamicDataResponse<ITypeService>) => {
        this.listTypeService = response.data;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get all type service', 'Error');
      });
  }
  getTypeServiceName(typeServiceId: string): string {
    const foundTypeService = this.listTypeService.find(
      (value) => value._id === typeServiceId
    );
    return foundTypeService ? foundTypeService.name : '';
  }

  filterTable(toSearch: any) {
    this.loadingService.showLoader();
    toSearch.columns = Object.assign([], this.serviceTableData.table_headers);
    toSearch.columns.splice(this.serviceTableData.table_headers.length - 1, 1);
    this.serviceService.filter(toSearch)
      .then((response: IDynamicDataResponse<IService>) => {
        const listService: any[] = [];
        response.data?.forEach((service) => {
          listService.push({
            amount: this.formatNumber(service.amount as any),
            fee: this.formatNumber(service.fee as any),
            name: service.name,
            typeService: this.getTypeServiceName(service.typeService),
            id: service._id,
            inputEditable: false,
            actions: [
              { show: true, action: 'edit', icon: 'fas fa-edit' },
              { show: true, action: 'delete', icon: 'fa-times' },
            ],
          });
        });
        this.serviceTableData.table_body = listService;
        this.serviceTableData.totalData = listService.length;
        this.loadingService.hideLoader();
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('error filter services', 'Error');
        this.loadingService.hideLoader();
      });
  }
  sortData($event: Event) {}

  pageChanger($event: Event) {}

  actionHandler(action: IAction) {
    switch (action.action) {
      case 'edit':
        this.routerlink.navigate([`/admin/services/update/${action.idItem}`]);
        break;
      case 'delete':
        this.serviceService
          .delete(action.idItem)
          .then((response) => {
            this.toast.warning('Servicio Eliminado', 'Advertencia');
            this.filterTable({});
          })
          .catch((error) => {
            this.toast.error('Ha ocurrido un error', 'error');
          });
        break;
    }
  }

  private formatNumber(value: number): string {
    const parts = value.toString().split('').reverse(); // Convertir el número a cadena y luego invertir el array
    let result = '';
    for (let i = 0; i < parts.length; i++) {
      result += parts[i];
      if ((i + 1) % 3 === 0 && i !== parts.length - 1) {
        result += '.'; // Agrega un punto después de cada grupo de tres dígitos
      }
    }
    return result.split('').reverse().join(''); // Invertir nuevamente para obtener el orden correcto
  }
}
