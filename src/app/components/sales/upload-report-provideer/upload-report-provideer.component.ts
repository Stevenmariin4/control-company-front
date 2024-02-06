import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProvideerService } from '../../../services/provideer/provideer.service';
import { IProvideer } from '../../../models/provideer.interface';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ExcelService } from '../../../services/excel/excel.service';
import { TypeServiceService } from '../../../services/type-service/type-service.service';
import { ServicesService } from '../../../services/services/services.service';
import { BranchOfficesService } from '../../../services/branch-offices/branch-offices.service';
import { ITypeService } from '../../../models/typeservice.interface';
import { IService } from '../../../models/services.interface';
import { IBranchOffices } from '../../../models/branch-offices.interface';
import { IDetailProvideer } from '../../../models/details-provideer.interface';
import { DetailProvideerService } from '../../../services/detail-provideer/detail-provideer.service';
import {
  IGroupedTransaction,
  ISales,
  ISalesDaily,
} from '../../../models/sales.interface';
import { LoadingService } from '../../../services/loading/loading.service';
import { SalesService } from '../../../services/sales/sales.service';
import { SalesDailyService } from '../../../services/sales-daily/sales-daily.service';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-upload-report-provideer',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    CurrencyPipe,
  ],
  templateUrl: './upload-report-provideer.component.html',
  styleUrl: './upload-report-provideer.component.scss',
})
export class UploadReportProvideerComponent implements OnInit {
  private provideerService = inject(ProvideerService);
  private typeServiceService = inject(TypeServiceService);
  private servicesService = inject(ServicesService);
  private branchOffice = inject(BranchOfficesService);
  private detailProvideer = inject(DetailProvideerService);
  private loadingService = inject(LoadingService);
  private salesService = inject(SalesService);
  private salesDailyService = inject(SalesDailyService);

  private toast = inject(ToastrService);
  private fb = inject(FormBuilder);
  private excelService = inject(ExcelService);

  public listProvideer: IProvideer[] = [];
  public listTypeService: ITypeService[] = [];
  public listService: IService[] = [];
  public listBranchOffices: IBranchOffices[] = [];
  public listDetailProvideer: IDetailProvideer[] = [];

  public listDetailReportSale: ISales[] = [];

  Form: FormGroup;
  excelData: any[] = [];

  constructor() {
    this.Form = this.fb.group({
      provideer: ['', Validators.required],
      isTest: [false],
    });
  }
  async ngOnInit(): Promise<void> {
    this.loadingService.showLoader();
    await this.getAllProvideer();
    await this.getAllBranchOffice();
    await this.getAllServices();
    await this.getAllTypeServices();
    this.loadingService.hideLoader();
  }

  selectProvideer() {
    const idProvideer = this.Form.value.provideer;
    this.loadingService.showLoader();
    this.detailProvideer
      .filter({})
      .then((response: IDetailProvideer[]) => {
        this.listDetailProvideer = response;
        this.loadingService.hideLoader();
      })
      .catch((error) => {
        this.toast.error('Error en la operacion', 'Error');
        this.loadingService.hideLoader();
      });
  }

  getAllProvideer() {
    this.provideerService
      .filter({})
      .then((response: IProvideer[]) => {
        this.listProvideer = response;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get Provideer', 'Error');
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
    this.servicesService
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
    this.branchOffice
      .filter({})
      .then((response: IBranchOffices[]) => {
        this.listBranchOffices = response;
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error get Provideer', 'Error');
      });
  }

  onFileSelected(event: any) {
    this.excelService.readExcel(event.target.files[0]).then((data: any[]) => {
      const provideer = this.listProvideer.find(
        (e) => e._id == this.Form.value.provideer
      );
      if (provideer) this.processExcelData(data, provideer);
    });
  }

  public processExcelData(data: any[][], provideer: IProvideer | null) {
    this.loadingService.showLoader();
    const processedData: any[] = [];
  
    if (provideer && data.length > 1) {
      const headers = Object.values(data[0]);
  
      // Obtener las configuraciones específicas del proveedor
      const branchOfficeConfig = provideer.headerBranchOffice;
      const dateTransactionConfig = provideer.headerDateTransaction;
      const typeTransactionConfig = provideer.headerTypeTransaction;
      const valueTransactionConfig = provideer.headerValueTransaction;
  
      for (let i = 1; i < data.length; i++) {
        const rowData = data[i];
  
        // Obtener los valores específicos del Excel según la configuración del proveedor
        const branchOffice = this.findValueInList(
          rowData[headers.indexOf(branchOfficeConfig)],
          this.listBranchOffices,
          this.changeIdProvideer(this.Form.value.provideer)
        );
        const dateTransaction = this.formatDate(
          rowData[headers.indexOf(dateTransactionConfig)]
        );
        const typeTransaction = this.findValueInList(
          rowData[headers.indexOf(typeTransactionConfig)],
          this.listDetailProvideer,
          'code'
        );
        const service = this.listService.find(
          (e) => e._id == typeTransaction?.service
        );
        const typeService = this.listTypeService.find(
          (e) => e._id === service?.typeService
        );
        const valueTransaction = rowData[headers.indexOf(valueTransactionConfig)];
  
        if (typeService && dateTransaction != '' && branchOffice) {
          const existingTransaction = processedData.find(
            (item) =>
              this.formatDate(item.dayTransaction) === this.formatDate(dateTransaction) &&
              item.amounByService.some(
                (serviceItem: any) =>
                  serviceItem.typeService === typeService._id &&
                  serviceItem.service === service?._id
              )
          );
  
          if (!existingTransaction) {
            // Si no existe un registro para este día
            processedData.push({
              dayTransaction: dateTransaction,
              branchOffices: branchOffice.id,
              amounByService: [
                {
                  typeService: typeService?._id,
                  service: service?._id,
                  totalAmount: this.calculateTotalAmount(
                    valueTransaction,
                    service?.amount || 0,
                    service?.fee || 0
                  ),
                },
              ],
            });
          } else {
            // Si ya existe, sumar el totalAmount al registro existente
            const existingService = existingTransaction.amounByService.find(
              (serviceItem: any) =>
                serviceItem.typeService === typeService?._id &&
                serviceItem.service === service?._id
            );
  
            if (existingService) {
              existingService.totalAmount += this.calculateTotalAmount(
                valueTransaction,
                service?.amount || 0,
                service?.fee || 0
              );
            } else {
              // Si no existe el servicio, agregar un nuevo registro para este servicio
              existingTransaction.amounByService.push({
                typeService: typeService?._id,
                service: service?._id,
                totalAmount: this.calculateTotalAmount(
                  valueTransaction,
                  service?.amount || 0,
                  service?.fee || 0
                ),
              });
            }
          }
        }
      }
    }
  
    this.loadingService.hideLoader();
    if (this.Form.value.isTest == false) {
      // Filtrar los datos procesados antes de insertar en la base de datos
      // const filteredData = this.test(processedData)
      // Insertar las transacciones en la base de datos
      this.insertSales(processedData);
    } else {
      // Usar los datos de prueba
      console.table(processedData);
      this.listDetailReportSale = processedData;
    }
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

  private findValueInList(value: any, list: any[], property: string): any {
    // Función para buscar un valor en una lista según una propiedad específica
    // Puedes personalizar según tus necesidades
    return list.find((item) => item[property] === value);
  }

  private changeIdProvideer(idProvideer: string): string {
    let fieldSearchProvideer = '';
    switch (idProvideer) {
      case 'belTHrePGILvTiGQfFys':
        fieldSearchProvideer = 'idProvideerPuntored';
        break;
      case '9b0u2LZdIDWDZgKlnLj8':
        fieldSearchProvideer = 'idProvideerRecargamosApp';
    }

    return fieldSearchProvideer;
  }
  /**
   * Calculates the total amount to be charged for a transaction based on the given parameters.
   * @param transactionAmount - The amount of the transaction.
   * @param amount - The base amount for the calculation.
   * @param fee - The fee amount for each multiple of the base amount.
   * @returns The total amount to be charged.
   */
  calculateTotalAmount(
    transactionAmount: number,
    amount: number,
    fee: number
  ): number {
    // Calculate how many times the base amount is included in the transaction amount.
    const multiples = Math.ceil(transactionAmount / amount);

    // Calculate the total amount by adding the fee for each multiple.
    const totalAmount = multiples * fee;

    // Return the result.
    return totalAmount;
  }

  private async insertSales(data: IGroupedTransaction[]) {
    try {
      this.loadingService.showLoader();
      for (const [index, e] of data.entries()) {
        const salesDaily = await this.getTransactionByDate(e.dayTransaction);
        if (salesDaily) {
          const existingGroup = salesDaily.groupTransaction || [];
          const groupData: IGroupedTransaction[] = [...data]; // Crear un nuevo array
  
          if (existingGroup.length > 0) {
            groupData.push(...existingGroup);
          }
  
          const bodyNewUpdate: ISalesDaily = {
            ...salesDaily,
            groupTransaction: groupData as any,
          };
          const dataForUpdate = this.verifyNotDuplicate(bodyNewUpdate);
          this.updateSalesDaily(bodyNewUpdate?.id || '', dataForUpdate);
        } else {
          const bodyCreate: ISalesDaily = {
            amountEnd: 0,
            amountStart: 0,
            groupTransaction: [data[index]] as any,
            dateSales: new Date(e.dayTransaction).toISOString(),
            branchOffices: e.branchOffices,
            totalAmount: 0,
          };
          this.createSalesDaily(bodyCreate, index, data.length);
        }
      }
      this.loadingService.hideLoader();
    } catch (error) {
      console.error(error);
    }
  }

  verifyNotDuplicate(data: ISalesDaily): ISalesDaily {
    const serviceIds: Set<string> = new Set();
  
    // Clonar el objeto para evitar modificar el original
    const newData: ISalesDaily = { ...data };
    newData.groupTransaction = newData.groupTransaction.filter(
      (groupTransaction) => {
        const uniqueServices = groupTransaction.amounByService.filter((service) => {
          const serviceId = service.service;
  
          // Verificar si el ID de servicio ya está en el conjunto
          if (serviceIds.has(serviceId)) {
            return false; // Eliminar servicio duplicado
          }
  
          // Agregar el ID de servicio al conjunto
          serviceIds.add(serviceId);
          return true;
        });
  
        // Si quedan servicios únicos, mantener la posición de groupTransaction
        return uniqueServices.length > 0;
      }
    );
  
    return newData;
  }
  
  
  
  

  async getTransactionByDate(date: string): Promise<ISalesDaily | null> {
    try {
      // Obtener la lista de ventas diarias
      const listSalesDaily: ISalesDaily[] = await this.salesDailyService.filter(
        {}
      );

      // Formatear la fecha de búsqueda para que coincida con el formato en la base de datos
      const formattedDate = date.split(' ')[0];

      // Buscar el id correspondiente a la fecha proporcionada
      let saleDaily: ISalesDaily | null = null;

      for (const sale of listSalesDaily) {
        // Formatear la fecha en la base de datos para comparación
        const formattedDBDate = sale.dateSales.split('T')[0];
        // Verificar si las fechas coinciden (sin tener en cuenta la hora)
        if (formattedDBDate === formattedDate) {
          saleDaily = sale;
        }
      }

      return saleDaily;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Method update table sales daily, try only send the update report pages here
   * @param id idSales
   * @param data data for update
   */
  updateSalesDaily(id: string, data: any) {
    this.salesDailyService
      .update(id, data)
      .then(() => {
        this.cleanForm();
        this.toast.success('Ventas registradas', 'Operación Exitosa');
      })
      .catch((error) => {
        console.error(error)
        this.toast.error('Error al registrar venta', 'Operación Fallida');
      });
  }

  createSalesDaily(
    data: ISalesDaily,
    numberTransacition: any,
    allTransaction: any
  ) {
    this.salesDailyService
      .create(data)
      .then(() => {
        this.cleanForm();
        this.toast.success(
          `Ventas registrada ${numberTransacition} de ${allTransaction}`,
          'Operación Exitosa'
        );
      })
      .catch((error) => {
        console.error(error);
        this.toast.error('Error al registrar venta', 'Operación Fallida');
      });
  }
  cleanForm() {
    this.Form.reset();
  }
}
