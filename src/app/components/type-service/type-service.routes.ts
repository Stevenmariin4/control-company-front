import { Routes } from '@angular/router';
import { ListTypeServiceComponent } from './list-type-service/list-type-service.component';
import { CreateUpdateTypeServiceComponent } from './create-update-type-service/create-update-type-service.component';

export const routes: Routes = [
  { path: 'list', component: ListTypeServiceComponent },
  { path: 'create', component: CreateUpdateTypeServiceComponent },
  { path: 'update/:id', component: CreateUpdateTypeServiceComponent },
];
