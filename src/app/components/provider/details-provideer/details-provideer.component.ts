import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DynamicTableComponent } from '../../../shared/components/dynamic-table/dynamic-table.component';
import { IProvideer } from '../../../models/provideer.interface';
import { IAction } from '../../../models/action.interface';
import { MatButtonModule } from '@angular/material/button';
import { IDataResponseDetailProvideer, IDetailProvideer } from '../../../models/details-provideer.interface';
import { DetailProvideerService } from '../../../services/detail-provideer/detail-provideer.service';
import { ToastrService } from 'ngx-toastr';
import { IService } from '../../../models/services.interface';
import { ServicesService } from '../../../services/services/services.service';
import { ElistOperationDatabase } from '../../../models/enum.tables';
import { IDynamicDataResponse } from '../../../models/dynamic.table.interface';

@Component({
  selector: 'app-details-provideer',
  standalone: true,
  imports: [RouterLink, MatCardModule, DynamicTableComponent, MatButtonModule],
  templateUrl: './details-provideer.component.html',
  styleUrl: './details-provideer.component.scss',
})
export class DetailsProvideerComponent implements OnInit {
  private routerlink = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  private detailsProvideerService = inject(DetailProvideerService);
  private toast = inject(ToastrService);
  private ServicesService = inject(ServicesService);

  public idProvideer: string | undefined;
  ListProvider: IProvideer[] = [];
  provideerTableData: any;
  session: any;
  listServices: IService[] = [];

  // items of filter
  sortColumn: any;
  filterApplied: any;
  pageNumber = 0;
  pageSize = 10;
  tableUser: any;

  constructor() {
    this.provideerTableData = {
      table_filters: [],
      table_headers: [
        {
          propertyName: 'service',
          nameToShow: 'Servicio',
          sort: 'asc',
          inputType: 'text',
        },
        {
          propertyName: 'code',
          nameToShow: 'Codigo',
          sort: 'asc',
          inputType: 'number',
        },
        {
          propertyName: 'excelHeader',
          nameToShow: 'Header',
          sort: 'asc',
          inputType: 'number',
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

  async ngOnInit(): Promise<void> {
    this.idProvideer =
      this.activeRouter.snapshot.paramMap.get('id') || undefined;
    await this.getAllServices();
    this.filterTable({});
  }

  getAllServices() {
    return new Promise<void>((resolve, reject) => {
      this.ServicesService.filter({})
        .then((response: IDynamicDataResponse<IService>) => {
          this.listServices = response.data;
          resolve();
        })
        .catch((error: any) => {
          this.toast.error('Error Get Services', 'Error');
          console.error(error);
          reject();
        });
    });
  }

  filterTable(toSearch: any) {
    toSearch.columns = Object.assign([], this.provideerTableData.table_headers);
    toSearch.columns.splice(2, 1);
    this.detailsProvideerService  
      .filter(toSearch, [
        { name: 'provideer', operator: ElistOperationDatabase['='], value: this.idProvideer },
      ])
      .then((response: IDataResponseDetailProvideer) => {
        const listService: any[] = [];
        response.data.forEach((data) => {
          const service = this.listServices.find(
            (service) => service._id === data.service
          );
          listService.push({
            service: service?.name,
            code: data.code,
            excelHeader: data.excelHeader,
            id: data.id,
            inputEditable: false,
            actions: [
              { show: true, action: 'edit', icon: 'fas fa-edit' },
              { show: true, action: 'delete', icon: 'fa-times' },
            ],
          });
        });
        this.provideerTableData.table_body = listService;
        this.provideerTableData.totalData = listService.length;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('error filter services', 'Error');
      });
  }
  sortData($event: Event) {}

  pageChanger($event: Event) {}

  actionHandler(action: IAction) {
    switch (action.action) {
      case 'edit':
        this.routerlink.navigate([
          `/admin/provideer/update/${this.idProvideer}/${action.idItem}`,
        ]);
        break;
      case 'delete':
        // this.serviceService
        //   .deleteService(action.idItem)
        //   .then((response) => {
        //     this.toast.warning('Servicio Eliminado', 'Advertencia');
        //     this.filterTable({});
        //   })
        //   .catch((error) => {
        //     this.toast.error('Ha ocurrido un error', 'error');
        //   });
        break;
    }
  }
}
