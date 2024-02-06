import { Routes } from '@angular/router';
import { ListBranchOfficesComponent } from './list-branch-offices/list-branch-offices.component';
import { CreateUdpateBranchOfficesComponent } from './create-udpate-branch-offices/create-udpate-branch-offices.component';

export const routes: Routes = [
  { path: 'list', component: ListBranchOfficesComponent },
  { path: 'create', component: CreateUdpateBranchOfficesComponent },
  { path: 'update/:id', component: CreateUdpateBranchOfficesComponent },
];
