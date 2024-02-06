import { Routes } from '@angular/router';
import { ListProductsComponent } from './list-products/list-products.component';
import { CreateUpdateProductComponent } from './create-update-product/create-update-product.component';

export const routes: Routes = [
  { path: 'list', component: ListProductsComponent },
  { path: 'create', component: CreateUpdateProductComponent },
  { path: 'update/id', component: CreateUpdateProductComponent },
];
