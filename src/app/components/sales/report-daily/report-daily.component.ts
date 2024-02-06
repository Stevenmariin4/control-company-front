import { Component, OnInit, inject } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateUpdateReportDailyComponent } from '../create-update-report-daily/create-update-report-daily.component';
import { SalesDailyService } from '../../../services/sales-daily/sales-daily.service';
import { IAmountByService, IGroupedTransaction, ISalesDaily } from '../../../models/sales.interface';
import { LoadingService } from '../../../services/loading/loading.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-report-daily',
  standalone: true,
  imports: [FullCalendarModule, MatDialogModule],
  templateUrl: './report-daily.component.html',
  styleUrl: './report-daily.component.scss',
})
export class ReportDailyComponent implements OnInit {
  salesDailyService = inject(SalesDailyService);
  loadingService = inject(LoadingService);
  toasService= inject(ToastrService)

  dialog = inject(MatDialog);
  calendarOptions: CalendarOptions;
  constructor() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      timeZone: 'local',
      //select: this.handleDateSelect.bind(this),
      plugins: [dayGridPlugin],
      events: [],
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventClick: this.openModalReportSalesDaily.bind(this),
    };
  }
  ngOnInit(): void {
    this.calendarOptions.events = [];
    this.getAllSalesDaily();
  }
  openModalReportSalesDaily(clickInfo?: EventClickArg) {
    const dialogRef = this.dialog.open(CreateUpdateReportDailyComponent, {
      width: '400px',
      data: { data: clickInfo?.event?._def?.publicId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllSalesDaily();
    });
  }

  getAllSalesDaily() {
    this.loadingService.showLoader();
    this.salesDailyService
      .filter({})
      .then((listSalesDaily: ISalesDaily[]) => {
        const events: any = [];
        listSalesDaily.forEach((sale) => {
          const totalAmount = this.sumTotalAmountByService(sale);
          events.push({
            id: sale.id,
            title: this.formatPrice(totalAmount),
            start: `${sale.dateSales}`,
            allDay: true,
            backgroundColor: this.returnColorByAmountEnd(sale.totalAmount),
          });
        });

        this.calendarOptions.events = events;
        this.loadingService.hideLoader();
      })
      .catch((error) => {
        console.error(error);
        this.toasService.error("Error al traer transacciones", "Error")
        this.loadingService.hideLoader();
      });
  }

  private sumTotalAmountByService(salesDaily: ISalesDaily): number {
    const groupedTransactions: IGroupedTransaction[] = salesDaily.groupTransaction;
    const totalAmountSum = groupedTransactions.reduce((accumulator, transaction) => {
      const amountByService: IAmountByService[] = transaction.amounByService;
      const transactionTotalAmountSum = amountByService.reduce(
        (serviceAccumulator, service) => serviceAccumulator + service.totalAmount,
        0
      );
  
      // Sumar el totalAmount de esta transacción al acumulador general
      return accumulator + transactionTotalAmountSum;
    }, 0);
  
    return totalAmountSum + salesDaily.totalAmount;
  }

  private formatPrice(price: number): string {
    // Convierte el número a string y agrega separadores de miles
    if(price){
      const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
      // Retorna el precio formateado con el símbolo de dólar
      return `$ ${formattedPrice}`;
    }
    return ''

  }
  private returnColorByAmountEnd(amount: number) {
    let color = '#F90000';

    if (amount > 0 && amount <= 50000) {
      color = '#F3A449 ';
    }

    if (amount > 50001 && amount <= 80000) {
      color = '#9BCC0E';
    }

    if (amount > 80000) {
      color = '#08FC08 ';
    }

    return color;
  }
}
