import { CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SalesDailyService } from '../../../services/sales-daily/sales-daily.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IAmountByService, ISalesDaily } from '../../../models/sales.interface';
import { BranchOfficesService } from '../../../services/branch-offices/branch-offices.service';
import { IBranchOffices } from '../../../models/branch-offices.interface';
import { LoadingService } from '../../../services/loading/loading.service';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ServicesService } from '../../../services/services/services.service';
import { ITypeService } from '../../../models/typeservice.interface';
import { IService } from '../../../models/services.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-update-report-daily',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    NgClass,
    CurrencyPipe,
  ],
  templateUrl: './create-update-report-daily.component.html',
  styleUrl: './create-update-report-daily.component.scss',
})
export class CreateUpdateReportDailyComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  salesDailyService = inject(SalesDailyService);
  branchOfficesService = inject(BranchOfficesService);
  typeServiceService = inject(TypeServiceService);
  serviceService = inject(ServicesService);
  private loadingService = inject(LoadingService);
  private toast = inject(ToastrService);

  formSalesDaily: FormGroup;
  idSales: string | undefined;
  listBranchOffices: IBranchOffices[] = [];
  listTypeService: ITypeService[] = [];
  listService: IService[] = [];
  listDetailSale: IAmountByService[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateUpdateReportDailyComponent>
  ) {
    this.formSalesDaily = this.formBuilder.group({
      branchOffices: ['', Validators.required],
      amountStart: [0, [Validators.required, Validators.min(0)]],
      amountEnd: [0, [Validators.min(0)]],
      dateSales: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getAllBranchOffices();
    await this.getAllService();
    await this.getAllTypeService();
    if (this.data.data) {
      this.idSales = this.data.data;
      this.getSalesById(this.idSales || '');
    }
  }

  getAllService() {
    this.serviceService
      .filter({})
      .then((listService) => {
        this.listService = listService;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error al obtener servicios', 'Error');
      });
  }

  getAllTypeService() {
    this.typeServiceService
      .filter({})
      .then((listTypeService) => {
        this.listTypeService = listTypeService;
      })
      .catch((error) => {
        this.toast.error('Error Obtener Tipos De Servicio', 'Error');
        console.error(error);
      });
  }

  getAllBranchOffices() {
    this.loadingService.showLoader();
    this.branchOfficesService
      .filter({})
      .then((listBranchOffices: IBranchOffices[]) => {
        this.listBranchOffices = listBranchOffices;
        this.loadingService.hideLoader();
      })
      .catch((error: any) => {
        this.toast.error('Error al traer las sucursales', 'Error');
        this.loadingService.hideLoader();
      });
  }

  getSalesById(id: string) {
    this.salesDailyService.getById(id)
      .then((data: ISalesDaily[]) => {
        const body = data[0];
  
        body.groupTransaction.forEach((groupTransaction) => {
          groupTransaction.amounByService.forEach((amountService) => {
            const service = this.getServiceById(amountService.service);
            const typeService = this.getTypeServiceById(amountService.typeService);
  
            this.listDetailSale.push({
              service: service?.name || '',
              typeService: typeService?.name || '',
              totalAmount: amountService.totalAmount,
            });
          });
        });
  
        const findService = this.getServiceById(environment.idServicePaper);
        const findTypeService = this.getTypeServiceById(environment.idTypeServicePaper);
  
        this.listDetailSale.push({
          service: findService?.name || '',
          typeService: findTypeService?.name || '',
          totalAmount: body.totalAmount,
        });
  
        this.formSalesDaily.patchValue({
          branchOffices: body.branchOffices,
          amountStart: body.amountStart,
          amountEnd: body.amountEnd,
          dateSales: this.formatDate(body.dateSales),
        });
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error al consultar', 'Error en la operación');
      });
  }
  
  private getServiceById(id: string): IService | undefined {
    return this.listService.find((e) => e._id == id);
  }
  
  private getTypeServiceById(id: string): ITypeService | undefined {
    return this.listTypeService.find((e) => e._id == id);
  }
    actionButtonSave() {
    if (this.idSales) {
      this.updateSalesDaily();
    } else {
      this.createSalesDaily();
    }
  }
  createSalesDaily() {
    const body: ISalesDaily = this.formSalesDaily.value;
    body.dateSales = new Date(body.dateSales).toISOString();
    if (body.amountEnd != 0) {
      body.totalAmount = this.calculateAmount(body.amountStart, body.amountEnd);
    }
    this.salesDailyService
      .create(body)
      .then(() => {
        this.toast.success('Operación Realizada', 'Operación exitosa');
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error Guardar', 'Error en la operación');
      });
  }

  updateSalesDaily() {
    const body: ISalesDaily = this.formSalesDaily.value;
    if (body.amountEnd != 0) {
      body.totalAmount = this.calculateAmount(body.amountStart, body.amountEnd);
    }
    this.salesDailyService
      .update(this.idSales || '', body)
      .then(() => {
        this.toast.success('Operación Realizada', 'Operación exitosa');
        this.dialogRef.close();
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error Guardar', 'Error en la operación');
      });
  }

  private formatDate(inputDate: string): string {
    try {
      if (!inputDate) return '';
      const dateObject = new Date(inputDate);
      return dateObject.toISOString().split('T')[0];
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  private calculateAmount(amountStart: number, amountEnd: number) {
    return amountEnd - amountStart;
  }
}
