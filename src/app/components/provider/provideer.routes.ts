import { Routes } from '@angular/router';
import { ListProviderComponent } from './list-provider/list-provider.component';
import { DetailsProvideerComponent } from './details-provideer/details-provideer.component';
import { CreateUpdateSettingProvideerComponent } from './create-update-setting-provideer/create-update-setting-provideer.component';

export const routes: Routes = [
   { path: 'list', component: ListProviderComponent },
   { path: 'detail/:id', component: DetailsProvideerComponent },
  { path: 'create/:idProvideer', component: CreateUpdateSettingProvideerComponent },
  { path: 'update/:idProvideer/:id', component: CreateUpdateSettingProvideerComponent },
];
