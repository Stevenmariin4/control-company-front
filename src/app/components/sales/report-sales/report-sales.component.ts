import { Component, OnInit, inject } from '@angular/core';
import { SalesService } from '../../../services/sales/sales.service';
import { ISales, SummaryItem } from '../../../models/sales.interface';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '../../../services/loading/loading.service';
import { BranchOfficesService } from '../../../services/branch-offices/branch-offices.service';
import { IBranchOffices } from '../../../models/branch-offices.interface';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ServicesService } from '../../../services/services/services.service';
import { ITypeService } from '../../../models/typeservice.interface';
import { IService } from '../../../models/services.interface';
import { CurrencyPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-report-sales',
  standalone: true,
  imports: [NgFor, CurrencyPipe],
  templateUrl: './report-sales.component.html',
  styleUrl: './report-sales.component.scss',
})
export class ReportSalesComponent implements OnInit {
  private salesService = inject(SalesService);
  private loadingService = inject(LoadingService);
  private toast = inject(ToastrService);
  private branchOfficesService = inject(BranchOfficesService);
  private typeServiceService = inject(TypeServiceService);
  private serviceService = inject(ServicesService);

  private listBranchOffices: IBranchOffices[] = [];
  private listTypeService: ITypeService[] = [];
  private listService: IService[] = [];
  public listSumaryItems: SummaryItem[] = [];

  ngOnInit(): void {
    this.getAllBranchOffice();
    this.getAllServices();
    this.getAllTypeServices();
    this.getAllSales();
  }

  getAllSales() {
    this.loadingService.showLoader();
    this.salesService
      .create({})
      .then((listSales) => {
        this.orderSales(listSales as any);
        this.loadingService.hideLoader();
      })
      .catch((error) => {
        this.loadingService.hideLoader();
        this.toast.error('Error en la operación', 'Error');
      });
  }

  getAllTypeServices() {
    this.typeServiceService
      .filter({})
      .then((response: ITypeService[]) => {
        this.listTypeService = response;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get Provideer', 'Error');
      });
  }
  getAllServices() {
    this.serviceService
      .filter({})
      .then((response: IService[]) => {
        this.listService = response;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get Provideer', 'Error');
      });
  }
  getAllBranchOffice() {
    this.branchOfficesService
      .filter({})
      .then((response: IBranchOffices[]) => {
        this.listBranchOffices = response;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get Provideer', 'Error');
      });
  }

  orderSales(salesData: ISales[]) {
    const summaryByBranchOffice: any = {};
    const summaryByTypeService: any = {};
    const summaryByService: any = {};

    salesData.forEach((sale) => {
      // Resumen por sucursal
      if (!summaryByBranchOffice[sale.branchOffices]) {
        const branchOffice = this.listBranchOffices.find(
          (e) => e._id == sale.branchOffices
        );
        summaryByBranchOffice[sale.branchOffices] = {
          id: 'Sucursal',
          value: branchOffice?.name,
          totalAmount: 0,
        };
      }
      summaryByBranchOffice[sale.branchOffices].totalAmount += sale.totalAmount;

      // Resumen por tipo de servicio
      if (!summaryByTypeService[sale.typeService]) {
        const typeService = this.listTypeService.find(
          (e) => e._id == sale.typeService
        );
        summaryByTypeService[sale.typeService] = {
          id: 'Tipo de Servicio',
          value: typeService?.name,
          totalAmount: 0,
        };
      }
      summaryByTypeService[sale.typeService].totalAmount += sale.totalAmount;

      // Resumen por servicio
      const serviceKey = `${sale.service}`;
      if (!summaryByService[serviceKey]) {
        console.log(serviceKey);
        const service = this.listService.find((e) => e._id == serviceKey);
        summaryByService[serviceKey] = {
          id: 'Servicio',
          value: service?.name,
          totalAmount: 0,
        };
      }
      summaryByService[serviceKey].totalAmount += sale.totalAmount;
    });

    const resultArray = Object.values({
      ...summaryByBranchOffice,
      ...summaryByTypeService,
      ...summaryByService,
    });
    this.listSumaryItems = resultArray as any;
  }
}
