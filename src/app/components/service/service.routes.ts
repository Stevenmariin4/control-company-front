import { Routes } from '@angular/router';
import { ListServicesComponent } from './list-services/list-services.component';
import { CreateUpdateServicesComponent } from './create-update-services/create-update-services.component';

export const routes: Routes = [
  { path: 'list', component: ListServicesComponent },
  { path: 'create', component: CreateUpdateServicesComponent },
  { path: 'update/:id', component: CreateUpdateServicesComponent },
];
