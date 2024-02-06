import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () =>
      import('./components/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'admin',
    loadChildren: () =>
    import('./components/layout/layout.routes').then((m) => m.routes),
  }
];
