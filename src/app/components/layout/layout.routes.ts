import { Routes } from '@angular/router';
import { InvitationComponent } from '../auth/invitation/invitation.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: ' invitation',
        component: InvitationComponent,
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../product/product.routes').then((m) => m.routes),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('../service/service.routes').then((m) => m.routes)
      },
      {
        path:'type-service',
        loadChildren: () =>
        import('../type-service/type-service.routes').then((m) => m.routes)
      },
      {
        path: 'branch-offices',
        loadChildren:()=>
        import('../branch-offices/branch-offices.routes').then((m)=> m.routes)
      },
      {
        path: 'provideer',
        loadChildren:()=>
        import('../provider/provideer.routes').then((m)=> m.routes)
      },
      {
        path: 'sales',
        loadChildren:()=> import('../sales/sales.routes').then((m)=> m.routes)
      }
    ],
  },
];
