import { Routes } from '@angular/router';
import { UploadReportProvideerComponent } from './upload-report-provideer/upload-report-provideer.component';
import { ReportSalesComponent } from './report-sales/report-sales.component';
import { ReportDailyComponent } from './report-daily/report-daily.component';

export const routes: Routes = [
  { path: 'upload', component: UploadReportProvideerComponent },
  { path: 'report', component: ReportSalesComponent },
  { path: 'daily', component: ReportDailyComponent },
];
